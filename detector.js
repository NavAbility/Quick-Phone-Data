function AprilTags() {
     var detections = [];

     var detect = Module.cwrap('detect', 'number', [
       'number', 'number', 'number', 'number'
     ]);

     var detected = Runtime.addFunction(function(
       id,
       x1,y1,x2,y2,x3,y3,x4,y4,
       m00,m01,m02,m10,m11,m12,m20,m21,m22
     ) {
       detections.push({
         id: id,
         x1: x1, y1: y1,
         x2: x2, y2: y2,
         x3: x3, y3: y3,
         x4: x4, y4: y4,
         m: [m00,m01,m02,m10,m11,m12,m20,m21,m22],
       })
     })

     var buf = null;

     return function(canvas) {
       var context = canvas.getContext("2d");

       var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
       if (buf == null) {
         console.log("Initializing buffer");
         buf = Module._malloc(imageData.data.length * imageData.data.BYTES_PER_ELEMENT);
       }
       Module.HEAPU8.set(imageData.data, buf);

       detections = [];
       detect(detected, canvas.width, canvas.height, buf);

       //TODO: Clean this up afterwards...
       // Module._free(buf);

       return detections;
     }
   }
