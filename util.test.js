const puppeteer = require('puppeteer');
const { generateText, checkAndGenerate } = require('./util');         //Importamos las funciones que queremos testear


/**UNIT TEST */

/**
 * Test es una función que viene con Jest, el primer argumento es un comentario que sale por consola cuando testeamos, 
 * el segundo es una función de callback que ejecuta los tests que queremos ejecutar
 */
test('should output name and age', () => {          //tipo de test que queremos testear, en este caso el output de nombre y edad
    const text = generateText('Max', 29);           //Guardamos el resultado de "generateText" 
    expect(text).toBe('Max (29 years old)');        //Comparamos el resultado de "generateText" con un resultado esperado, tanto si sale bien o mal se mostrará por consola.
    const text2 = generateText('Ana', 78);
    expect(text2).toBe('Ana (78 years old)'); 
});

// test('should output data-less text', () => {        //tipo de test que queremos testear, en este caso si damos el nombre vacio o no pasamos ningún  parámetro
//     const text = generateText('', null);
//     expect(text).toBe(' (null years old)');
//     const text2 = generateText();
//     expect(text2).toBe('undefined (undefined years old)');
// });



/**INTEGRATION TEST */

test('should generate a valid text output', () => { //Estamos viendo un test donde se compara un resultado esperado de varias funciones integradas con un resultado que debería ser 
    const text = checkAndGenerate('Max', 29);
    expect(text).toBe('Max (29 years old)');
})



/**E2E TEST */

test('should create an element with text and correct class', async () => {
    const browser = await puppeteer.launch({        //La función de puppeteer es asíncrona
        headless: false,                            //Parámetros del navegador que correrá el test
        slowMo: 80, 
        args: ['--window-size=1920,1080']
    });

    const page = await browser.newPage();           //Creamos una página que cargará el navegador
    await page.goto(__dirname +  '/index.html');    //Damos una url absoluta que tiene que cargar la página

    await page.click('input#name');                 //Funciones que hará la página sobre el DOM, en este caso hace click en "input#name"
    await page.type('input#name', 'Ana');           //Escribe Ana en el "input#name"
    await page.click('input#age');                  //Hace click en "input#age"
    await page.type('input#age', '78');             //Escribe 78 en "input#age"
    await page.click('#btnAddUser');                //Hace click en el boton "#btnAddUser"
    const finalText = await page.$eval('.user-item', el => el.textContent) //Recupera el valor que se genera al hacer click en "AddUser", el valor se encuentra en un item
    expect(finalText).toBe('Ana (78 years old)');   //Se compara el valor recuperado con un resultado esperado.
}, 10000);                                          //Podemos añadir más tiempo (10s) para que pueda evaluar los tests
