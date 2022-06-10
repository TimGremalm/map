import L from 'leaflet';
import 'leaflet.locatecontrol';
import { loadZones } from './loaders/loadZones';
import { loadNatureReserve } from './loaders/loadNatureReserve';
import { loadFireRoads } from './loaders/loadFireRoads';
import { loadCampClusters } from './loaders/loadCampClusters';
import { loadTooltipZoom, loadBoarderlandMarker } from './utils/loadTooltipZoom';
import { loadPositionControl } from './utils/loadPositionControl';

export const createMap = async () => {
    const map = L.map('map', { zoomControl: false }).setView([57.621111, 14.927857], 17);


    await loadZones(map);
    await loadNatureReserve(map);
    await loadFireRoads(map);
    await loadCampClusters(map);
    await loadTooltipZoom(map);
    await loadBoarderlandMarker(map);
    await loadPositionControl(map);

    const googleSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);
};
