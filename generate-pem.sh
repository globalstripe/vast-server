# https://medium.com/@KentaKodashima/generate-pem-keys-with-openssl-on-macos-ecac55791373

openssl genpkey -algorithm RSA -aes-256-cbc -outform PEM -out private_key.pem -pkeyopt rsa_keygen_bits:2048
chmod 400 private_key.pem
ssh-keygen -e -f private_key.pem > public_key.pem
