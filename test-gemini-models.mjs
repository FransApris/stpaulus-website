const apiKey = 'AIzaSyCDES80Ae1Gcrehw6hGUGOYUUnUecpwoZ4';

async function listModels() {
    try {
        console.log('Fetching available models...\n');

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Available models:');
        data.models?.forEach(model => {
            if (model.supportedGenerationMethods?.includes('generateContent')) {
                console.log(`\n✅ ${model.name}`);
                console.log(`   Display Name: ${model.displayName}`);
                console.log(`   Methods: ${model.supportedGenerationMethods.join(', ')}`);
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

listModels();
