const express = require('express');
const { soap } = require('strong-soap');
const app = express();
const port = 8000;

// Servicio SOAP
const service = {
  MyService: {
    MyPort: {
      MyFunction: (args) => {
        console.log('SOAP request received:', args);
        return { result: `Order ID ${args.order_id} processed` };
      }
    }
  }
};

// Definir el WSDL
const wsdl = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
             xmlns:tns="http://localhost:8000"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema"
             xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"
             targetNamespace="http://localhost:8000">
  <message name="MyFunctionRequest">
    <part name="order_id" type="xsd:int"/>
    <part name="event" type="xsd:string"/>
  </message>
  <message name="MyFunctionResponse">
    <part name="result" type="xsd:string"/>
  </message>
  <portType name="MyPortType">
    <operation name="MyFunction">
      <input message="tns:MyFunctionRequest"/>
      <output message="tns:MyFunctionResponse"/>
    </operation>
  </portType>
  <binding name="MyBinding" type="tns:MyPortType">
    <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="MyFunction">
      <soap:operation soapAction="urn:MyFunction"/>
      <input>
        <soap:body use="encoded" namespace="urn:MyFunction" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
      </input>
      <output>
        <soap:body use="encoded" namespace="urn:MyFunction" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
      </output>
    </operation>
  </binding>
  <service name="MyService">
    <port name="MyPort" binding="tns:MyBinding">
      <soap:address location="http://localhost:8000/soap"/>
    </port>
  </service>
</definitions>`;

// Ruta GET para servir el WSDL
app.get('/', (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send(wsdl);
});

// Iniciar el servidor SOAP
app.listen(port, () => {
  console.log(`SOAP server running on http://localhost:${port}`);
});

// Definir la ruta /soap que maneja las solicitudes POST SOAP
app.post('/soap', (req, res) => {
  const url = `http://localhost:${port}/soap`;

  soap.listen(app, '/soap', service, wsdl);

  res.send('SOAP service is running at /soap');
});
