import * as functions from 'firebase-functions';
import { database } from 'firebase-admin';

interface Data {
  city: string | null;
  coordinates: string | null;
  country: string | null;
  ipAddress: string | null;
  rawHeaders: object;
  region: string | null;
  uid: string | null;
  userAgent: string;
}
interface IpAddrInfoResponse {
  success: boolean;
  data: Data;
}

export const getIpAddrInfo = functions.https.onRequest((request, response) => {
  const host: string = request.headers.host;
  const query = request.query ? request.query : null;
  const rawHeaders: Array<string> = request.rawHeaders;
  const cityIndex: number = rawHeaders.indexOf('X-Appengine-City');
  const coordinatesIndex: number = rawHeaders.indexOf('X-Appengine-Citylatlong');
  const countryIndex: number = rawHeaders.indexOf('X-Appengine-Country');
  const ipAddressIndex: number = rawHeaders.indexOf('X-Appengine-User-Ip');
  const regionIndex: number = rawHeaders.indexOf('X-Appengine-Region');

  // When running functions locally, most of these properties will not be found in raw headers
  // and will default to null;
  const city: string | null = cityIndex >= 0 ? rawHeaders[cityIndex + 1] : null;
  const coordinates: string | null = coordinatesIndex >= 0 ? rawHeaders[coordinatesIndex + 1] : null;
  const country: string | null = countryIndex >= 0 ? rawHeaders[countryIndex + 1] : null;
  // If running functions locally, the IP address will not exist in raw headers.  Use the host instead
  const ipAddress: string | null = ipAddressIndex >= 0 ? rawHeaders[ipAddressIndex + 1] : host;
  const region: string | null = regionIndex >= 0 ? rawHeaders[regionIndex + 1] : null;

  const responseObject: IpAddrInfoResponse = {
    data: {
      city,
      coordinates,
      country,
      ipAddress,
      rawHeaders: request.rawHeaders,
      region,
      uid: query.uid || null,
      userAgent: request.headers['user-agent'],
    },
    success: true, 
  };

  console.log({ ...responseObject, ts: Date.now()});

  return response.send(responseObject);
});
