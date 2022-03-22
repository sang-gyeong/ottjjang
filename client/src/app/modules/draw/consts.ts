import * as AWS from 'aws-sdk';
import {environment} from 'src/environments/environment';

export const BackgroundColors = [
  'black',
  'white',
  'tomato',
  'orange',
  'gold',
  'green',
  'skyblue',
  'blue',
  'purple',
  'brown',
  'grey',
];

export const MAX_KEYS = 300;
export const OBJECT_STORE_HEADER = 'https://summber-obj.kr.object.ncloudstorage.com/';
export const END_POINT = 'https://kr.object.ncloudstorage.com';

export const bucket = new AWS.S3({
  endpoint: new AWS.Endpoint(END_POINT),
  region: environment.region,
  credentials: {
    accessKeyId: environment.accessKeyId,
    secretAccessKey: environment.secretAccessKey,
  },
});
