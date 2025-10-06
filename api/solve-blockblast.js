export default async function handler(request, response) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { image } = request.body;

    if (!image) {
      return response.status(400).json({ 
        success: false, 
        message: 'No image provided' 
      });
    }

    // Generate solution steps (simulated)
    const steps = [
      {
        step: 1,
        description: 'Hancurkan blok di area merah terlebih dahulu. Fokus pada kelompok blok besar.',
        image: generatePlaceholderImage('red', 'Step 1: Area Merah')
      },
      {
        step: 2,
        description: 'Setelah area merah hancur, lanjutkan ke kelompok blok di area biru.',
        image: generatePlaceholderImage('blue', 'Step 2: Area Biru')
      },
      {
        step: 3,
        description: 'Bersihkan sisa blok di area hijau untuk menyelesaikan level.',
        image: generatePlaceholderImage('green', 'Step 3: Area Hijau')
      }
    ];

    response.status(200).json({
      success: true,
      steps: steps,
      message: 'Solusi berhasil ditemukan!'
    });

  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan: ' + error.message 
    });
  }
}

function generatePlaceholderImage(color, text) {
  const colors = {
    red: 'ff0000',
    blue: '0000ff', 
    green: '00ff00'
  };
  
  return `https://via.placeholder.com/400x300/${colors[color]}/ffffff?text=${encodeURIComponent(text)}`;
}
