import * as recastai from "recastai";
import Future from 'fibers/future';
import * as fs from 'fs';

const enClient = new recastai.request('2b18eed7e1c716f8a269bae8664a6a2d', 'en');

Meteor.methods({
  getRecastIntent(transcript, language) {
    console.log("language, transcript:", language, transcript);
    var future = new Future();

    enClient.analyseText(transcript).then(function(text) {
      console.log("text.intent():", text.intent());

      let intent = text.intent();
      if (intent && intent.confidence > .6 &&
          intent.slug === "change-shirt-color" &&
          text.entities.color) {
        console.log("text.entities:", text.entities);
        fs.writeFile("/tmp/over_here_arnaud", text.entities.color[0].rgb,
            function(err) {
          if(err) {
            console.log("err:", err);
          }

          console.log("The file was saved!", text.entities.color[0].rgb);
        });
      }

      future.return({
        intent,
        entities: text.entities,
      });
    });

    console.log("Returning recast intent: ");
    console.log(future.intent);
    console.log(future.entities);

    return future.wait();
  },
});
