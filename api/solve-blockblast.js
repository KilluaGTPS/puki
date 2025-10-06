export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    // Simulate image processing (without canvas)
    const steps = generateSolutionSteps();
    
    res.status(200).json({
      success: true,
      steps: steps,
      message: 'Solution generated successfully!'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing image: ' + error.message 
    });
  }
}

function generateSolutionSteps() {
  // Return mock solution steps with placeholder images
  return [
    {
      step: 1,
      description: 'Hancurkan blok di area merah terlebih dahulu. Ini akan membuka ruang untuk kombinasi berikutnya.',
      image: 'https://via.placeholder.com/400x300/ff0000/ffffff?text=Step+1+Area+Merah'
    },
    {
      step: 2,
      description: 'Setelah area merah hancur, fokus pada kelompok blok di area biru untuk membuat chain reaction.',
      image: 'https://via.placeholder.com/400x300/0000ff/ffffff?text=Step+2+Area+Biru'
    },
    {
      step: 3,
      description: 'Bersihkan sisa blok di area hijau. Pilih kelompok terbesar untuk skor maksimal.',
      image: 'https://via.placeholder.com/400x300/00ff00/ffffff?text=Step+3+Area+Hijau'
    }
  ];
}
