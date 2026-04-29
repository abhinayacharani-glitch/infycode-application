import db from "../config/firebase.js";
import sendEmail from "../utils/sendEmail.js";

const trainersRef = db.ref("trainers");

const stages = ['Applied', 'Screening', 'Interview', 'Selected', 'Onboarded'];

// ✅ SUBMIT TRAINER APPLICATION
export const submitApplication = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, expertise, experience, location, linkedin, portfolio, bio, resume } = req.body;

    if (!firstName || !lastName || !email || !phone || !expertise || !experience || !location) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const fullName = `${firstName} ${lastName}`;
    const newTrainerRef = trainersRef.push();
    const trainerData = {
      fullName,
      email,
      phone,
      specialty: expertise,
      experience,
      location,
      linkedin,
      portfolio,
      bio,
      resume, // Base64 string
      status: 'Applied',
      progress: 0,
      isSeen: false, // Notification badge flag
      createdAt: new Date().toISOString()
    };

    await newTrainerRef.set(trainerData);

    // Send "Applied" email
    await sendEmail({
      to: email,
      subject: "Trainer Application Received - InfyCode",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 20px; borderRadius: 8px;">
          <h2 style="color: #2563eb;">Hello ${fullName},</h2>
          <p>Thank you for applying to become a trainer at <strong>InfyCode</strong>.</p>
          <p>Your application has been received. Our team will review your profile and get back to you soon.</p>
          <p style="background: #f1f5f9; padding: 15px; border-radius: 6px; font-weight: bold;">Current Status: Applied</p>
          <p>Please wait for the next step.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
      `
    });

    res.status(201).json({ success: true, message: "Application submitted successfully", id: newTrainerRef.key });
  } catch (error) {
    console.error("Error submitting trainer application:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE TRAINER APPLICATION STATUS (Admin Only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'next', 'hold', 'reject'

    const trainerSnap = await trainersRef.child(id).once("value");
    if (!trainerSnap.exists()) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    const trainer = trainerSnap.val();
    let newStatus = trainer.status;
    let newProgress = trainer.progress;
    let sendNotifyEmail = false;
    let emailSubject = "";
    let emailHtml = "";

    if (action === 'hold') {
      if (trainer.status === 'Hold') {
        newStatus = trainer.prevStatus || 'Applied';
        const restoredIndex = stages.indexOf(newStatus);
        newProgress = (restoredIndex / (stages.length - 1)) * 100;
        await trainersRef.child(id).update({ status: newStatus, progress: newProgress });
        return res.json({ success: true, message: "Hold released", status: newStatus });
      } else {
        await trainersRef.child(id).update({ prevStatus: trainer.status, status: 'Hold' });
        return res.json({ success: true, message: "Trainer put on hold", status: 'Hold' });
      }
    }

    if (action === 'reject') {
      newStatus = 'Rejected';
      newProgress = 0;
      sendNotifyEmail = true;
      emailSubject = "Update regarding your Trainer Application - InfyCode";
      emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 20px; borderRadius: 8px;">
          <h2 style="color: #e11d48;">Hello ${trainer.fullName},</h2>
          <p>Thank you for your interest in joining <strong>InfyCode</strong> as a trainer.</p>
          <p>After careful review of your application and experience, we regret to inform you that we will not be moving forward with your application at this time.</p>
          <p>We appreciate the time you took to apply and wish you the best in your future endeavors.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">Best regards,<br/>InfyCode Onboarding Team</p>
        </div>
      `;
    } else if (action === 'next') {
      const baseStatus = trainer.status === 'Hold' ? (trainer.prevStatus || 'Applied') : trainer.status;
      const currentIndex = stages.indexOf(baseStatus);
      if (currentIndex < stages.length - 1) {
        const nextIndex = currentIndex + 1;
        newStatus = stages[nextIndex];
        newProgress = (nextIndex / (stages.length - 1)) * 100;
        sendNotifyEmail = true;
        emailSubject = `Congratulations! You've moved to the ${newStatus} stage - InfyCode`;
        
        let customMessage = "";
        switch (newStatus) {
          case 'Screening': customMessage = "Your profile has been selected for the screening round. Our team will review your technical expertise in detail."; break;
          case 'Interview': customMessage = "You have been shortlisted for the interview round. We will contact you shortly to schedule a time."; break;
          case 'Selected': customMessage = "We are pleased to inform you that you have been selected to join our faculty! We will start the final onboarding process."; break;
          case 'Onboarded': customMessage = "Welcome aboard! You are now officially onboarded as a trainer at InfyCode. We are excited to have you on our team."; break;
        }

        emailHtml = `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 20px; borderRadius: 8px;">
            <h2 style="color: #2563eb;">Hello ${trainer.fullName},</h2>
            <p>We have some exciting news regarding your trainer application at <strong>InfyCode</strong>.</p>
            <p style="font-size: 16px; font-weight: bold; color: #1d4ed8;">${customMessage}</p>
            <div style="margin: 25px 0; background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Current Stage</p>
              <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 800; color: #0f172a;">${newStatus}</p>
            </div>
            <p>Our team will reach out to you with further details soon.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">Best regards,<br/>InfyCode Onboarding Team</p>
          </div>
        `;
      }
    }

    await trainersRef.child(id).update({ 
      status: newStatus, 
      progress: newProgress, 
      prevStatus: newStatus,
      isSeen: true // Clear from notifications once acted upon
    });

    if (sendNotifyEmail) {
      await sendEmail({
        to: trainer.email,
        subject: emailSubject,
        html: emailHtml
      });
    }

    res.json({ success: true, message: `Trainer updated to ${newStatus}`, status: newStatus });
  } catch (error) {
    console.error("Error updating trainer status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ MARK ALL APPLICATIONS AS SEEN (Admin Only)
export const markAllApplicationsAsSeen = async (req, res) => {
  try {
    const snapshot = await trainersRef.once("value");
    if (!snapshot.exists()) {
      return res.json({ success: true, message: "No applications found" });
    }

    const updates = {};
    snapshot.forEach((child) => {
      const trainer = child.val();
      if (trainer.isSeen === false || trainer.isSeen === undefined) {
        updates[`${child.key}/isSeen`] = true;
      }
    });

    if (Object.keys(updates).length > 0) {
      await trainersRef.update(updates);
    }

    res.json({ success: true, message: "All applications marked as seen" });
  } catch (error) {
    console.error("Error marking applications as seen:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
