import db from "../config/firebase.js";

const materialsCollection = db.collection("materials");

/**
 * @desc Get materials for a specific batch
 * @route GET /api/materials/:batchId
 */
export const getBatchMaterials = async (req, res) => {
  try {
    const { batchId } = req.params;
    const snapshot = await materialsCollection.doc(batchId).collection("items").get();
    
    if (snapshot.empty) {
      return res.status(200).json({ success: true, materials: [] });
    }

    // Convert object to array and fix broken placeholder URLs if found
    const materials = snapshot.docs.map(doc => {
      const material = doc.data();
      let url = material.fileUrl;
      // Self-healing: if the URL is the old broken placeholder, swap it for a working one
      if (url && url.includes("firebase") && url.includes("placeholders%2Fsample.pdf")) {
        url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
      }
      return {
        id: doc.id,
        ...material,
        fileUrl: url,
      };
    });

    res.status(200).json({ success: true, materials });
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ success: false, error: "Failed to fetch materials" });
  }
};

/**
 * @desc Upload/Save material metadata
 * @route POST /api/materials/upload
 */
export const uploadMaterial = async (req, res) => {
  try {
    const { batchId, moduleName, fileName, fileUrl, trainerId, trainerName } = req.body;

    if (!batchId || !moduleName || !fileName) {
      return res.status(400).json({ success: false, error: "Batch ID, Module Name, and File Name are required" });
    }

    const newMaterial = {
      moduleName,
      fileName,
      fileUrl: fileUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Reliable Placeholder
      trainerId: trainerId || "T1",
      trainerName: trainerName || "Trainer",
      uploadedAt: new Date().toISOString(),
    };

    const docRef = await materialsCollection.doc(batchId).collection("items").add(newMaterial);

    res.status(201).json({
      success: true,
      message: "Material metadata saved successfully",
      material: { id: docRef.id, ...newMaterial },
    });
  } catch (error) {
    console.error("Error saving material:", error);
    res.status(500).json({ success: false, error: "Failed to save material metadata" });
  }
};

