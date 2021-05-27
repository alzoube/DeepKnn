
var saveButton = document.getElementById('saveButton');
var reloadgButton = document.getElementById('reloadButton');


let net;
const webcamElement = document.getElementById('webcam');
 const KNNClass = new KNN();




// async function appx() {
//   console.log('Loading mobilenet..');

//   // Load the model.
//   net = await mobilenet.load();
//   console.log('Sucessfully loaded model');

//   // Make a prediction through the model on our image.
//   const imgEl = document.getElementById('img');
//   const result = await net.classify(imgEl);
//   console.log(result);
// }

async function appxx() {
    console.log('Loading mobilenet..');
  
    // Load the model.
    net = await mobilenet.load();
    console.log('Sucessfully loaded model');
    
    await setupWebcam();
    tick();
}
   async function tick() {

      const result = await net.classify(webcamElement);
  
      document.getElementById('console').innerText = `
        prediction: ${result[0].className}\n
        probability: ${result[0].probability}
      `;
  
      // Give some breathing room by waiting for the next animation frame to
      // fire.
     
      requestAnimationFrame(tick);
       await tf.nextFrame();
    }
  

  async function app() {
    console.log('Loading mobilenet..');
  
    // Load the model.
    net = await mobilenet.load();
    console.log('Sucessfully loaded model');

    await setupWebcam();

    // Reads an image from the webcam and associates it with a specific class
    // index.
    const addExample = classId => {
      // Get the intermediate activation of MobileNet 'conv_preds' and pass that
      // to the KNN classifier.
      const activation = net.infer(webcamElement, 'conv_preds');
  
      // Pass the intermediate activation to the classifier.
      //classifier.addExample(activation, classId);

      KNNClass.addExample(activation,classId);

    };
  
    // When clicking a button, add an example for that class.
    document.getElementById('class-a').addEventListener('click', () => addExample("0"));
    document.getElementById('class-b').addEventListener('click', () => addExample("1"));
    document.getElementById('class-c').addEventListener('click', () => addExample("2"));



  
    while (true) {
      // if (classifier.getNumClasses() > 0) {
      //   // Get the activation from mobilenet from the webcam.
      //   const activation = net.infer(webcamElement, 'conv_preds');
      //   // Get the most likely class and confidences from the classifier module.
      //   const result = await classifier.predictClass(activation);
  
      //   const classes = ['A', 'B', 'C'];
      //   document.getElementById('console').innerText = `
      //     prediction: ${classes[result.classIndex]}\n
      //     probability: ${result.confidences[result.classIndex]}
      //   `;
      // }

      if (KNNClass.getNumLabels() > 0){

        const features = net.infer(webcamElement, 'conv_preds');

        KNNClass.classify(features, gotResults);

      }

      await tf.nextFrame();
      //requestAnimationFrame();
    }
  }//app()







// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }

  // if (result.confidencesByLabel) {
  //   const confidences = result.confidencesByLabel;
  //   // result.label is the label that has the highest confidence
  //   if (result.label) {
  //     select('#result').html(result.label);
  //     select('#confidence').html(`${confidences[result.label] * 100} %`);
  //   }

  //   select('#confidenceRock').html(`${confidences['Rock'] ? confidences['Rock'] * 100 : 0} %`);
  //   select('#confidencePaper').html(`${confidences['Paper'] ? confidences['Paper'] * 100 : 0} %`);
  //   select('#confidenceScissor').html(`${confidences['Scissor'] ? confidences['Scissor'] * 100 : 0} %`);
  // }
       // const classes = ['A', 'B', 'C'];
        document.getElementById('console').innerText =result.label;
        
        // `
        //   prediction: ${classes[result.classIndex]}\n
        //   probability: ${result.confidences[result.classIndex]}
        // `;
  //classify();
}


saveButton.onclick = function saveMyKNN() {
  KNNClass.save('myKNNDataset');
}

reloadButton.onclick = function loadMyKNN() {
  KNNClass.load('./myKNNDataset.json', updateCounts);
}



// Update the example count for each label	
function updateCounts() {
  const counts = KNNClass.getCountByLabel();

  // select('#exampleRock').html(counts['Rock'] || 0);
  // select('#examplePaper').html(counts['Paper'] || 0);
  // select('#exampleScissor').html(counts['Scissor'] || 0);
}

// Clear the examples in one label
function clearLabel(label) {
  KNNClass.clearLabel(label);
  updateCounts();
}

// Clear all the examples in all labels
function clearAllLabels() {
  KNNClass.clearAllLabels();
  updateCounts();
}








async function setupWebcam() {
    return new Promise((resolve, reject) => {
      const navigatorAny = navigator;
      navigator.getUserMedia = navigator.getUserMedia ||
          navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
          navigatorAny.msGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true},
          stream => {
            webcamElement.srcObject = stream;
            webcamElement.addEventListener('loadeddata',  () => resolve(), false);
          },
          error => reject());
      } else {
        reject();
      }
    });
  }

app();