#!/usr/bin/env node
var path = require('path');
var program = require('commander');
var pkg = require( path.join(__dirname, 'package.json') );
const execSync = require('child_process').execSync;

// TODO Parse command line options
var cert = '';
var chainCert = '';
program
    .version(pkg.version)
    .option('-C, --chain <certificate chain>', 'The chain containing Intermediate and Root certificates for the one being validated')
    .option('-c, --cert <certificate>', 'The certificate to be validated. Can be in PKCS#12 or X509 PEM format.')
    .parse(process.argv);

// TODO Determine if cert is PKCS#12 and needs conversion to X509
var isCertPKCS12 = execSync('openssl pkcs12 -nokeys -nomacver -noout -in '+cert);
if(isCertPKCS12 ){
	// TODO Run command to convert to X509
	cert = '';
} else {
	process.exit();
}

// TODO Determine if expiration date has elapsed from stdin
var hasExpired = 'openss x509 -checkend 0 -noout -in '+cert;
if(hasExpired){
	console.log('Certificate has expired!');
	// TODO Get the expiration date and maybe some details and print them
	process.exit();
}

// TODO Determine if chain is PKCS#12 and needs conversion to X509
if(chainCert == 'pkcs12'){
	// TODO Run command to convert to X509
	chainCert = '';
} else {
	process.exit();
}

// TODO Obtain OCSP URL from original certificate
var ocsp_uri = 'openssl x509 -noout -ocsp_uri -in '+cert;

// TODO Contact OCSP URI to ensure certificate was not revoked
var hasBeenRevoked = 'openssl ocsp -issuer '+chainCert+' -cert '+cert+' -url '+ocsp_uri+' -CAfile '+chainCert+' -header Host '+ocsp_uri
if(hasBeeRevoked){
	console.log('Certificate was revoked!');
	// TODO Extract and print reason
} else {
	console.log('Certificate appears valid: hasn\'t expired and wasn\'t revoked.');
}

process.exit();
