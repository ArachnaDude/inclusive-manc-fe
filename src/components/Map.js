import { useContext, useState } from "react";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { MapContainer, TileLayer } from "react-leaflet";
import geoJsonData from "../data/manchesterSmallData.json";
import { UserContext } from "../contexts/User.js";
import NotLoggedInError from "./NotLoggedInError";
import Search from "./Search";
// switched PointsCluster to PointsCluster2
import PointsCluster from "./PointsCluster2";
import { CoordinatesRefactoring } from "../utils/DataRefactoring";
import UserLocation from "./UserLocation";
import UserLocationButtons from "./UserLocationButtons";

function MainMap() {
  const [userLocationVisibility, setUserLocationVisibility] = useState(true);
  const [searchResult, setSearchResult] = useState("");

  const userPos = [53.4833, -2.24478];

  const { isLoggedIn } = useContext(UserContext);
  const LoggedInCheck = JSON.parse(localStorage.getItem("isLoggedIn"));

  const points = geoJsonData.features.map((place) => {
    return {
      type: "Feature",
      properties: {
        cluster: false,
        placeId: place.id,
        placeName: place.properties.name,
      },
      geometry: {
        type: "Point",
        coordinates: CoordinatesRefactoring(place.geometry.coordinates),
      },
    };
  });

  if (isLoggedIn === true || LoggedInCheck === true) {
    return (
      <>
        <MapContainer
          className="leaflet-container"
          center={userPos}
          zoom={19}
          maxZoom={20}
        >
          <TileLayer
            maxNativeZoom={19}
            maxZoom={20}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Search className="searchbar" setSearchResult={setSearchResult} />
          <UserLocationButtons
            pos={userPos}
            setUserLocationVisibility={setUserLocationVisibility}
          />
          {userLocationVisibility ? <UserLocation pos={userPos} /> : <></>}
          <PointsCluster points={points} searchResult={searchResult} />
          <Footer />
        </MapContainer>
      </>
    );
  } else {
    return (
      <>
        <NotLoggedInError />
      </>
    );
  }
}

export default MainMap;
