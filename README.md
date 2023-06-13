# Codificación de Huffman

El algoritmo de codificación de Huffman se basa en la construcción de un árbol binario de prefijos, donde cada hoja representa un carácter y cada camino desde la raíz hasta una hoja determina el código binario asignado a ese carácter.

Aquí tienes los pasos para calcular la tabla de Huffman y representarla:

1. Paso 1: Preparación de datos
    - Haz una lista de caracteres y sus frecuencias correspondientes en el texto.
    - Ordena la lista en orden ascendente según las frecuencias.
2. Paso 2: Creación del árbol de Huffman
    - Inicialmente, cada carácter se convierte en un nodo hoja con su frecuencia asociada.
    - Toma los dos nodos con menor frecuencia y combínalos en un nuevo nodo interno cuya frecuencia es la suma de las frecuencias de los nodos originales.
    - Agrega el nuevo nodo al conjunto de nodos disponibles y repite este paso hasta que solo quede un nodo.
3. Paso 3: Asignación de códigos binarios
    - Asigna un código binario de 0 a la rama izquierda y 1 a la rama derecha en cada nodo interno.
    - Recorre el árbol desde la raíz hasta cada hoja y registra el código binario resultante para cada carácter.
4. Paso 4: Creación de la tabla de Huffman
    - Crea una tabla que muestre cada carácter y su correspondiente código binario.

A continuación, te mostraré un ejemplo sencillo para que puedas comprender mejor el proceso. Supongamos que tenemos los siguientes caracteres y frecuencias:

1. Preparación de datos: La lista ordenada sería: `f:1, o:1, r:1, g:2, k:2, s:2, e:4`.

```
Caracter | Frecuencia
--------------------
   e    |    4
   f    |    1
   g    |    2
   k    |    2
   o    |    1
   r    |    1
   s    |    2

```

2. Creación del árbol de Huffman:

El paso 2 del algoritmo de Huffman implica la creación del árbol de Huffman. Aquí tienes una explicación más detallada:

Preparación de datos: Ordena los caracteres y sus frecuencias en orden ascendente según las frecuencias. En tu caso, la lista ordenada sería:

```
Caracter | Frecuencia
--------------------
   f    |    1
   o    |    1
   r    |    1
   g    |    2
   k    |    2
   s    |    2
   e    |    4
```

- Paso 2: Combinación de nodos con menor frecuencia:
    - Combinamos los caracteres 'f', 'o' y 'r' en un nuevo nodo interno con frecuencia 1+1+1=3.
    - Combinamos los caracteres 'g', 'k' y 's' en un nuevo nodo interno con frecuencia 2+2+2=6.
    - El carácter 'e' se convierte en un nodo hoja con frecuencia 4.

```
	               13
            /         \
          9            4
       /     \         e
     3         6
    / \       / \
   f o r     g k s
```

1. Asignación de códigos binarios:

```
   f: 00
   o: 0
   r: 100
   g: 101
   k: 110
   s: 111
   e: 10

```

1. Creación de la tabla de Huffman:

```
Caracter | Código
-----------------
   f    |   00
   o    |   01
   r    |  100
   g    |  101
   k    |  110
   s    |  111
   e    |   10

```

Esta es la tabla de Huffman resultante, donde cada carácter tiene asignado su código binario correspondiente.

```jsx
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
```

El código que has proporcionado implementa el algoritmo de compresión y descompresión de Huffman en JavaScript. A continuación, te explicaré cada parte del código y cómo funciona:

1. Definición de la clase `HuffmanNode`:
Esta clase representa un nodo en el árbol de Huffman. Cada nodo tiene un carácter (`char`), una frecuencia (`freq`) y referencias a los nodos hijos izquierdo (`left`) y derecho (`right`).
2. Función `buildHuffmanTree(text)`:
Esta función construye el árbol de Huffman a partir del texto de entrada. Primero, calcula las frecuencias de los caracteres en el texto utilizando la función `calculateFrequencies(text)`. Luego, crea nodos hoja para cada carácter con su respectiva frecuencia. A continuación, combina los nodos en el árbol de Huffman hasta que solo quede un nodo raíz. La función devuelve la raíz del árbol.
3. Función `calculateFrequencies(text)`:
Esta función calcula las frecuencias de los caracteres en el texto. Utiliza un objeto (`frequencies`) para realizar el recuento de ocurrencias de cada carácter.
4. Funciones `encodeText(text, huffmanTree)` y `decodeText(encodedText, huffmanTree)`:
Estas funciones se encargan de codificar y decodificar el texto utilizando el árbol de Huffman. La función `encodeText` genera un mapa de codificación (`encodingMap`) utilizando la función `generateEncodingMap(huffmanTree)`. Luego, itera sobre cada carácter del texto y concatena los códigos correspondientes. La función `decodeText` recorre el texto codificado bit a bit y sigue el camino en el árbol de Huffman para encontrar el carácter correspondiente.
5. Funciones `generateEncodingMap(huffmanTree)` y `traverseTree(node, code)`:
Estas funciones se utilizan para generar el mapa de codificación a partir del árbol de Huffman. La función `generateEncodingMap` crea un mapa vacío (`encodingMap`) y llama a la función `traverseTree` para recorrer el árbol y asignar los códigos a cada carácter.
6. Funciones `calculateCompressionRate(originalSize, compressedSize)` y `writeEncodedTextAndTree(encodedText, huffmanTree, outputFile)`:
Estas funciones se encargan de calcular la tasa de compresión y escribir el texto codificado y el árbol en un archivo de salida. La función `calculateCompressionRate` utiliza el tamaño original y el tamaño comprimido para calcular la tasa de compresión. La función `writeEncodedTextAndTree` crea un objeto (`outputData`) con el texto codificado y el árbol, y lo guarda en el archivo de salida en formato JSON.
7. Funciones `readEncodedTextAndTree(inputFile)` y `decompressWithHuffman(inputFile, outputFile)`:
Estas funciones se utilizan para leer el texto codificado y el árbol desde un archivo de entrada y realizar la descompresión. La función `readEncodedTextAndTree` lee los datos desde el archivo de entrada y los devuelve en formato JSON. La función `decompressWithHuffman` utiliza los datos leídos para decodificar el texto y guardarlo en el archivo de salida.
8. Funciones principales `compressWithHuffman(inputFile, outputFile)`

### Como se construyo el árbol?

Para construir el árbol de Huffman, se siguen los siguientes pasos:

1. Calcular las frecuencias de los caracteres en el texto.
2. Crear nodos hoja iniciales para cada carácter con su respectiva frecuencia.
3. Combinar los nodos de menor frecuencia en un nuevo nodo interno con una frecuencia igual a la suma de las frecuencias de los nodos combinados.
4. Repetir el paso anterior hasta que solo quede un nodo raíz.

Aquí tienes un ejemplo paso a paso de cómo se construye el árbol de Huffman utilizando el texto "ABRACADABRA":

1. Calcular las frecuencias de los caracteres en el texto:
A: 5
B: 2
R: 2
C: 1
D: 1
2. Crear los nodos hoja iniciales:
    - Nodo A (frecuencia 5)
    - Nodo B (frecuencia 2)
    - Nodo R (frecuencia 2)
    - Nodo C (frecuencia 1)
    - Nodo D (frecuencia 1)
3. Combinar los nodos de menor frecuencia:
    - Combinar Nodo C (frecuencia 1) y Nodo D (frecuencia 1) en un nuevo nodo interno con frecuencia 2.
    - Combinar Nodo B (frecuencia 2) y Nodo R (frecuencia 2) en un nuevo nodo interno con frecuencia 4.
    - Combinar Nodo A (frecuencia 5) y el nodo interno anterior (frecuencia 4) en un nuevo nodo interno con frecuencia 9.

El árbol de Huffman resultante para el texto "ABRACADABRA" sería el siguiente:

```
           raíz
           /  \\
          /    \\
         /      \\
        9        \\
       / \\        \\
      /   \\        \\
     A     4        \\
          / \\        \\
         /   \\        \\
        2     2        \\
       / \\   / \\        \\
      B   R C   D

```

En este árbol, cada nodo hoja representa un carácter y cada camino desde la raíz hasta un nodo hoja representa el código binario asignado a ese carácter en la codificación de Huffman. Los códigos binarios se asignan siguiendo el camino hacia la izquierda para el bit '0' y hacia la derecha para el bit '1'.

En este caso, los códigos binarios serían:

- A: 0
- B: 10
- R: 11
- C: 100
- D: 101

Estos códigos se utilizarían para codificar el texto utilizando el algoritmo de Huffman.

### Bibliografía

[https://www.techiedelight.com/es/huffman-coding/](https://www.techiedelight.com/es/huffman-coding/)

[http://www.lcc.uma.es/~monte/MaterialDocente/TIC/practicas/practica3.pdf](http://www.lcc.uma.es/~monte/MaterialDocente/TIC/practicas/practica3.pdf)