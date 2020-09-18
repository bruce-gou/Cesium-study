import React, { useEffect, userState } from 'react';
import './App.css';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";





// Your access token can be found at: https://cesium.com/ion/tokens.
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYmM3ZDMwMS04ZjM5LTQxM2ItYTNmZS1hNDgxNDM4ZmY5OGQiLCJpZCI6MzM3MTMsImlhdCI6MTU5OTExNDMyOH0.mHiYmR0-HzNHWRgjMwZwehSqinogLzB2l_n15O_nRFQ';
let viewer;
function App() {
  useEffect(() => {
    viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    });
    const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());
    // addBuildingGeoJSON();
    // 隐藏周围建筑物
    buildingTileset.style = new Cesium.Cesium3DTileStyle({
      show: {
        conditions: [
          // Any building that has this elementId will have `show = false`.
          ['${elementId} === 332469316', false],
          ['${elementId} === 332469317', false],
          ['${elementId} === 235368665', false],
          ['${elementId} === 530288180', false],
          ['${elementId} === 530288179', false],
          ['${elementId} === 332466474', false],
          // If a building does not have one of these elementIds, set `show = true`.
          [true, true]
        ]
      },
      color: "Boolean(${feature['cesium#color']}) ? color(${feature['cesium#color']}) : color('#ffffff')"
    });
    // 加载 替换的建筑物
    const newBuildingTileset = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(152880)
      })
    );
    // Move the camera to the new building.
    viewer.flyTo(newBuildingTileset);
  }, []);
  // 第三步，加载占位图
  async function addBuildingGeoJSON() {
    // Load the GeoJSON file from Cesium ion.
    const geoJSONURL = await Cesium.IonResource.fromAssetId(152868);
    // Create the geometry from the GeoJSON, and clamp it to the ground.
    const geoJSON = await Cesium.GeoJsonDataSource.load(geoJSONURL, { clampToGround: true });
    // Add it to the scene.
    const dataSource = await viewer.dataSources.add(geoJSON);
    // By default, polygons in CesiumJS will be draped over all 3D content in the scene.
    // Modify the polygons so that this draping only applies to the terrain, not 3D buildings.
    for (const entity of dataSource.entities.values) {
      entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
    }
    // Move the camera so that the polygon is in view.
    viewer.flyTo(dataSource);
  }
  return (
    <div>
      <div id='cesiumContainer'></div>
    </div>
  );
}

export default App;
