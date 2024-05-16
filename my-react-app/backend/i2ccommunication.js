const i2c = require('i2c-bus');
const I2C_BUS_NUMBER = 1;
const DEVICE_ADDRESS = 0x48;

const bus = i2c.openSync(I2C_BUS_NUMBER);

function sendMessage(){
    const send =0x01;
    const buffer = Buffer.from([send]);
    bus.i2cWriteSync(Device_ADDRESS, buffer.length, buffer);
    console.log(send);
}

function receiveMessage(){
    let readBuffer = Buffer.alloc(10);
    bus.i2cWriteSync(Device_ADDRESS, 10, readBuffer);
    console.log(readBuffer);
    
}


// Run Functions:
sendMessage();
receiveMessage();

// Close Bus
bus.closeSync();
