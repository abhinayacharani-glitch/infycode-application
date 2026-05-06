/**
 * courseUtils.js
 * Centralized utility for course-related data transformations.
 * "Courses" page is the single source of truth for images.
 */

export const getCourseImage = (course) => {
  if (!course) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';

  const title = course.title?.toLowerCase() || '';
  const category = course.category?.toLowerCase() || '';
  
  // 1. Strict Unique Mapping for ALL Courses
  if (title.includes('aptitude'))
    return 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800';

  if (title.includes('introduction to ai') || title.includes('artificial intelligence'))
    return 'https://images.unsplash.com/photo-1677442135136-760c813028c0?q=80&w=800';

  if (title.includes('machine learning'))
    return 'https://images.unsplash.com/photo-1677442135136-760c813028c0?q=80&w=800';

  if (title.includes('data science') || title.includes('data science & ai'))
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfUFmKmFDvY4rg76EzhS6nH0r_B7Uk_oxluw&s';

  if (title.includes('ethical hacking') || title.includes('cyber'))
    return 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800';

  if (title.includes('aws cloud'))
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGmDSGbTH-i5CQrYChKGpjJw6qslkwx17WA&s';

  if (title.includes('python programming'))
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTyjgXu6v0rqvaMPcMFFE8brUD50uqVoE3jA&s';

  if (title.includes('java full stack'))
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-UQ1ZxmHn79QekyobNr31jn-eqAppZGX1uQ&s';

  if (title.includes('react js'))
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_X2qpzOAIrmc5A0-Hf6IxpapkhunI8vauKg&s';

  if (title.includes('next.js'))
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQPswpztQ7IcYpegK2-BrPNRkrkyqddXEqZQ&s';

  if (title.includes('mern stack'))
    return 'https://www.rlogical.com/wp-content/uploads/2020/12/MERN.webp';

  if (title.includes('angular'))
    return 'https://miro.medium.com/1*jAwFJjRn0DYRA3fnxrR9PQ.jpeg';

  if (title.includes('flutter'))
    return 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800';

  if (title.includes('full stack python'))
    return 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800';

  // 2. Category Fallbacks
  if (category.includes('web'))
    return 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800';

  if (category.includes('python'))
    return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800';

  if (category.includes('java'))
    return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800';

  if (category.includes('cloud'))
    return 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800';

  if (category.includes('ai'))
    return 'https://images.unsplash.com/photo-1620712943543-bcc4628c6bb5?q=80&w=800';

  if (category.includes('cyber'))
    return 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800';

  return course.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800';
};

/**
 * Helper to parse the bracket-formatted curriculum string into a structured modules array.
 */
export const parseCurriculum = (text) => {
  if (!text) return [];
  const sections = text.split(/(?=\[.*\])/g).filter(Boolean);
  return sections.map((section, idx) => {
    const lines = section.trim().split('\n').filter(Boolean);
    const headerLine = lines[0];
    const isHeader = headerLine.startsWith('[') && headerLine.endsWith(']');
    const title = isHeader ? headerLine.slice(1, -1) : 'General';
    const topics = isHeader ? lines.slice(1) : lines;
    return {
      id: `module-${idx}`,
      subtitle: title,
      topics: topics.map((t, i) => ({
        id: `topic-${idx}-${i}`,
        title: t
      }))
    };
  });
};
