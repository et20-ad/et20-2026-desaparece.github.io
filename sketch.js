
let imagePairs0 = [
  { a: "familia1.jpg", b: "familia1_b.jpg" },
  { a: "familia2.jpg", b: "familia2_b.jpg" },
  { a: "familia3.jpg", b: "familia3_b.jpg" },
  { a: "familia4.jpg", b: "familia4_b.jpg" }
];

let familiesA = [];
let familiesB = [];

let currentIndex = 0; 

let state = 0;
let fadeAlpha = 0;
let overlayAlpha = 255;

let imageFade = 255;
let targetImageFade = 255;

function preload() {
  for (let i = 0; i < imagePairs.length; i++) {
    familiesA[i] = loadImage(imagePairs[i].a);
    familiesB[i] = loadImage(imagePairs[i].b);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  selectNewFamily();
  textFont('sans-serif');
}

function draw() {
  background(0);

  // 1. Dibuja ambas imágenes, una arriba de la otra, para lograr el crossfade
  // Imagen B (la "intervenida") SIEMPRE abajo
  drawResponsiveImage(familiesB[currentIndex]);

  // Imagen A (original) arriba con opacidad
  tint(255, imageFade);
  drawResponsiveImage(familiesA[currentIndex]);
  noTint();

  // 2. Control de los fundidos (Overlay)
  let targetOverlay = 0;
  if (state === 0 ) {
    targetOverlay = 100; 
  } else if (state === 1 ) {
    targetOverlay = 100;  
  } else if (state === 2 ) {
    targetOverlay = 0;  
  } else if (state === 3) {
    targetOverlay = 100; 
  } else if (state === 4) {
    targetOverlay = 140;  
  } else if (state === 5) {
    targetOverlay = 160; 
  } else if (state === 6) {
    targetOverlay = 190; 
  } else if (state === 7) {
    targetOverlay = 220; 
  } else if (state >= 8) {
    targetOverlay = 255; // Cita y cierre: Negro total
  }

  overlayAlpha = lerp(overlayAlpha, targetOverlay, 0.05);
 
  fill(0, overlayAlpha);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, width, height);

  // 3. Márgenes generales
  let marginX = width * 0.20;
  let marginY = height * 0.15;
  let boxWidth = width * 0.60;
  let boxHeight = height * 0.70;

  fadeAlpha = lerp(fadeAlpha, 255, 0.05);
 
  fill(255, 255, 255, fadeAlpha);
  textAlign(CENTER, CENTER);
 
  let titleSize = width < 600 ? 28 : 48;
  let bodySize = width < 600 ? 18 : 32;
  let citeSize = width < 600 ? 16 : 24;
  let hintSize = width < 600 ? 14 : 16;

  if (state < 2) {
    targetImageFade = 255;
  } else {
    targetImageFade = 0;
  }


  // 4. FLUJO NARRATIVO
  switch(state){
    case 0:
        textSize(titleSize);
        textStyle(BOLD);
        text("¿Cuántas personas ves en esta foto?", marginX, marginY, boxWidth, boxHeight);
        drawHint("Toca la pantalla para comenzar", hintSize);
    break;
    case 1:
        textSize(titleSize);
        textStyle(BOLD);
        text("¿Qué pasa cuando una de ellas desaparece?", marginX, marginY, boxWidth, boxHeight);
        drawHint("Toca la pantalla para continuar", hintSize);
    break;
    case 2:
    break;
    case 3:
        textSize(bodySize);
        textStyle(BOLD);
        text("Cuando una persona desaparece, aparece un vacío inexplicable en la vida de su familia.", marginX, marginY, boxWidth, boxHeight);
    break;
    case 4:
        
    break;
    case 5:
        textSize(titleSize * 0.8);
        textStyle(BOLD);
        text("No sabemos dónde está.\nNo sabemos si vive.", marginX, marginY, boxWidth, boxHeight);
    break;
    case 6:
        textSize(bodySize);
        textStyle(BOLD);
        text("El 24 de Marzo de 1976, comenzó en Argentina una dictadura cívico-militar.", marginX, marginY, boxWidth, boxHeight);
    break;
    case 7:
        textSize(bodySize);
        textStyle(BOLD);
        text("Miles de personas fueron secuestradas y hechas desaparecer por el Estado.", marginX, marginY, boxWidth, boxHeight);
    break;
    case 8:
        // CITA: Calculamos el ancho exacto para centrarla perfectamente en X y en Y
        let quote = "“El desaparecido es una incógnita.\nNo está ni muerto ni vivo: está desaparecido.”\n\n— Jorge Rafael Videla";
    
        textSize(citeSize);
        textStyle(NORMAL);
    
        // Medimos la línea más larga para saber cuánto ocupa el bloque
        let longestLine = "No está ni muerto ni vivo: está desaparecido.”";
        let blockWidth = textWidth(longestLine);
    
        // Si estamos en un celular y el texto es muy ancho, lo limitamos
        let finalWidth = min(blockWidth, width * 0.85);
    
        // Calculamos el punto de inicio en X para que quede justo en el medio
        let finalX = (width - finalWidth) / 2;
    
        textAlign(LEFT, CENTER);
        // Al usar 0 para el inicio en Y y "height" para la altura de la caja,
        // p5.js centra el texto verticalmente de forma automática y perfecta.
        text(quote, finalX, 0, finalWidth, height);
    
        textAlign(CENTER, CENTER); // Restauramos para el próximo estado


    break;
    case 9:
        textSize(titleSize);
        textStyle(BOLD);
        text("De esto se trató ser un desaparecido.", marginX, marginY, boxWidth, boxHeight);

    break;
  }
}

// Control de los clics y cambios de imagen
function mousePressed() {
  if (state < 9) {
    state++;
    fadeAlpha = 0;
  } else {
    state = 0;
    fadeAlpha = 0;
    overlayAlpha = 255;
    imageFade = 255;

    selectNewFamily();
    
  }
  if (state === 2) {
      imageFade = 0; // desaparece de golpe
  }
}

function selectNewFamily() {
  if (imagePairs.length > 1) {
    let nextIndex;
    do {
      nextIndex = floor(random(imagePairs.length));
    } while (nextIndex === currentIndex);
    currentIndex = nextIndex;
  } else {
    currentIndex = 0;
  }
 
  currentImage = familiesA[currentIndex];
}

function drawResponsiveImage(img) {
  let imgAspect = img.width / img.height;
  let canvasAspect = width / height;
  let drawWidth, drawHeight;

  if (canvasAspect > imgAspect) {
    drawWidth = width;
    drawHeight = width / imgAspect;
  } else {
    drawHeight = height;
    drawWidth = height * imgAspect;
  }
 
  imageMode(CENTER);
  image(img, width / 2, height / 2, drawWidth, drawHeight);
}

function drawHint(txt, size){
  textSize(size);
  textStyle(NORMAL);

  fill(255, 255, 255, fadeAlpha * 0.6); // más tenue que el texto principal

  text(
    txt,
    width * 0.15,
    height * 0.85,
    width * 0.70,
    height * 0.10
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}