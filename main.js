const fs = require('fs');

// Definir la clase para el nodo del árbol de Huffman
class HuffmanNode {
  constructor(char, freq, left, right) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

// Función para construir el árbol de Huffman
function buildHuffmanTree (text) {
  // Calcular las frecuencias de los caracteres en el texto
  const charFrequencies = calculateFrequencies(text);

  // Crear los nodos hoja iniciales

  const nodes = [];
  for (const char in charFrequencies) {
    nodes.push(new HuffmanNode(char, charFrequencies[char], null, null));
  }

  // Construir el árbol de Huffman
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    const parent = new HuffmanNode(null, left.freq + right.freq, left, right);
    nodes.push(parent);
  }

  // Retornar la raíz del árbol de Huffman
  return nodes[0];
}

// Función para calcular las frecuencias de los caracteres en el texto
function calculateFrequencies (text) {
  const frequencies = {};
  for (const char of text) {
    frequencies[char] = frequencies[char] + 1 || 1;
  }
  return frequencies;
}

// Función para codificar el texto utilizando el árbol de Huffman
function encodeText (text, huffmanTree) {
  const encodingMap = generateEncodingMap(huffmanTree);
  let encodedText = '';
  for (const char of text) {
    encodedText += encodingMap[char];
  }
  return encodedText;
}

// Función para generar el mapa de codificación utilizando el árbol de Huffman
function generateEncodingMap (huffmanTree) {
  const encodingMap = {};

  function traverseTree (node, code) {
    if (!node.left && !node.right) {
      encodingMap[node.char] = code;
    } else {
      traverseTree(node.left, code + '0');
      traverseTree(node.right, code + '1');
    }
  }

  traverseTree(huffmanTree, '');

  return encodingMap;
}

// Función para decodificar el texto utilizando el árbol de Huffman
function decodeText (encodedText, huffmanTree) {
  let decodedText = '';
  let currentNode = huffmanTree;

  for (const bit of encodedText) {
    if (bit === '0') {
      currentNode = currentNode.left;
    } else if (bit === '1') {
      currentNode = currentNode.right;
    }

    if (!currentNode.left && !currentNode.right) {
      decodedText += currentNode.char;
      currentNode = huffmanTree;
    }
  }

  return decodedText;
}

// Función para calcular la tasa de compresión
function calculateCompressionRate (originalSize, compressedSize) {
  return ((originalSize - compressedSize) / originalSize) * 100;
}

// Función para escribir el texto codificado y el árbol en un archivo de salida
function writeEncodedTextAndTree (encodedText, huffmanTree, outputFile) {
  const outputData = {
    encodedText,
    huffmanTree,
  };

  fs.writeFileSync(outputFile, JSON.stringify(outputData));
}

// Función para leer el texto codificado y el árbol desde un archivo de entrada
function readEncodedTextAndTree (inputFile) {
  const inputData = fs.readFileSync(inputFile, 'utf8');
  return JSON.parse(inputData);
}

// Función principal
function compressWithHuffman (inputFile, outputFile) {
  // Leer el archivo de entrada
  let inputText;
  try {
    inputText = fs.readFileSync(inputFile, 'utf8');

  } catch (error) {
    console.log('El archivo no existe.');
    return;
  }
  // Construir el árbol de Huffman
  const huffmanTree = buildHuffmanTree(inputText);

  // Codificar el texto
  const encodedText = encodeText(inputText, huffmanTree);

  // Escribir el texto codificado y el árbol en el archivo de salida
  writeEncodedTextAndTree(encodedText, huffmanTree, outputFile);

  // Calcular la tasa de compresión
  const originalSize = inputText.length * 8; // Tamaño original en bits
  const compressedSize = encodedText.length; // Tamaño comprimido en bits
  const compressionRate = calculateCompressionRate(originalSize, compressedSize);

  // Mostrar el mensaje y la tasa de compresión
  console.log('El texto se ha codificado correctamente.');
  console.log(`Tasa de compresión: ${compressionRate.toFixed(2)}%`);
}

// Función para decodificar el archivo comprimido
function decompressWithHuffman (inputFile, outputFile) {
  // Leer el archivo de entrada
  const { encodedText, huffmanTree } = readEncodedTextAndTree(inputFile);

  // Decodificar el texto
  const decodedText = decodeText(encodedText, huffmanTree);

  // Escribir el texto decodificado en el archivo de salida
  fs.writeFileSync(outputFile, decodedText);

  console.log('El archivo se ha decodificado correctamente.');
}

// Ejemplo de uso
compressWithHuffman('input.txt', 'compressed.huff');
decompressWithHuffman('compressed.huff', 'output.txt');

