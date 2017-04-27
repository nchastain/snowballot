var Firebase = require('firebase');
var ElasticClient = require('elasticsearchclient')
import {firebaseRef} from '.././firebase/constants.js'

// initialize our ElasticSearch API
var client = new ElasticClient({ host: 'localhost', port: 9200 });

// listen for changes to Firebase data
firebaseRef.on('child_added',   createOrUpdateIndex);
firebaseRef.on('child_changed', createOrUpdateIndex);
firebaseRef.on('child_removed', removeIndex);

function createOrUpdateIndex(snap) {
   client.index(this.index, this.type, snap.val(), snap.key())
     .on('data', function(data) { console.log('indexed ', snap.key()); })
     .on('error', function(err) { /* handle errors */ });
}

function removeIndex(snap) {
   client.deleteDocument(this.index, this.type, snap.key(), function(error, data) {
      if( error ) console.error('failed to delete', snap.key(), error);
      else console.log('deleted', snap.key());
   });
}

var queue = new Firebase(process.env.DATABASE_URL + '/search');
queue.child('request').on('child_added', processRequest);

function processRequest(snap) {
   snap.ref().remove(); // clear the request after we receive it
   var data = snap.val();
   // Query ElasticSearch
   client.search(dat.index, dat.type, { "query": { 'query_string': { query: dat.query } }
   .on('data', function(data) {
       // Post the results to https://<INSTANCE>.firebaseio.com/search/response
       queue.child('response/'+snap.key()).set(results);
   })
   .on('error', function(error){ /* process errors */ })
   .exec()
}
