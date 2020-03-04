import React from "react";
import "./App.css";
import styled from "styled-components";
import axios from "axios";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import dclookup from './utils/dclookup'
const AddressParser = require("hk-address-parser-lib");

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  input {
    width: 90%;
    height: 40px;
    border: 1px solid blue;
  }
`;

function App() {
  const MapWithAMarker = withScriptjs(
    withGoogleMap(props => (
      <GoogleMap defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
        <Marker position={{ lat: -34.397, lng: 150.644 }} />
      </GoogleMap>
    ))
  );

  // return (
  //   <Container><MapWithAMarker
  //   googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCSEipzniNAZLQoaWFFwOv-ZXU6O1FgJj0&libraries=places"
  //   loadingElement={<Container style={{ height: `100%` }} />}
  //   containerElement={<Container style={{ height: `400px` }} />}
  //   mapElement={<Container style={{ height: `100%` }} />}
  // /></Container>
  // );

  const onChangeHKGov = async e => {
    //https://www.als.ogcio.gov.hk/lookup?q=<以自由文本格式輸入地址>
    const value = e.target.value;
    const response = await axios({
      type: "POST",
      ContentType: "application/json",
      url: `https://www.als.ogcio.gov.hk/lookup?q=${value}`
    });

    if (response.data && response.data.SuggestedAddress) {
      const geo = response.data.SuggestedAddress[0].Address.PremisesAddress.GeospatialInformation
      console.log("geo district=",  dclookup.dcNameFromCoordinates(geo.Latitude, geo.Longitude));
    }
  };

  const onChangeHKParser = async e => {
    const value = e.target.value;
    const records = await AddressParser.parse(value);
    records.forEach((item, index) => {
      console.log(
        item,
        dclookup.dcNameFromCoordinates(item.coordinate().lat, item.coordinate().lng), 
        item.fullAddress(AddressParser.Address.LANG_ZH), 
        " =============================================== ",
        item.fullAddress(AddressParser.Address.LANG_EN)
      );
    });
  };

  const onChangeGoogle = async e => {
    console.log("TODO Google React");
  };

  return (
    <>
      <Container>
        <input
          placeholder="HK Gov Address Api"
          onChange={onChangeHKGov}
          type="text"
        />
      </Container>
      <Container>
        <input
          placeholder="hk-address-parser-lib"
          onChange={onChangeHKParser}
          type="text"
        />
      </Container>
      <Container>
        <input
          placeholder="Google React"
          onChange={onChangeGoogle}
          type="text"
        />
      </Container>
    </>
  );
}

export default App;
