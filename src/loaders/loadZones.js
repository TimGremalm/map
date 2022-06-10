import L from 'leaflet';
import { ZONES_GEOJSON, ZONES_SPREADSHEET_JSON } from '../constants';
import { loadSpreadSheet } from '../utils/loadSpreadSheet';
import { loadGeoJson } from '../utils/loadGeoJson';

export const loadZones = async (map) => {
    const zonedata = await loadSpreadSheet(ZONES_SPREADSHEET_JSON);

    const data = await loadGeoJson(ZONES_GEOJSON, () => ({
        style: function (feature) {
            let color = 'yellow';

            //ok, really messy to have this in here. Where should it go?
            for (let i = 0; i < zonedata.length; i++) {
                const [id, name, abbrevation, notice, sound, description] = zonedata[i];

                // convert to string
                if (id === '' + feature.properties.fid) {
                    feature.properties = {
                        ...feature.properties,
                        name, abbrevation, notice, sound, description,
                    };
                    // Set at which zoom-level the tooltip should dissappear
                    feature.properties.minzoom = 16
                }
            }

            return {
                weight: 3,
                opacity: 0.75,
                color: color,
                dashArray: '5',
                fillOpacity: 0,
                zIndex: 0,
            };
        },onEachFeature: (feature, layer) => {
            layer.bindTooltip(
                "<span style='color: #ffa; opacity: 0.9; text-shadow: 2px 2px #000000; font-weight: bold; font-size: 0.8rem;'>" +
                    feature.properties.name +
                    '</span>',
                { permanent: true, direction: 'center' },
            );
        },
    }));

    data.addTo(map).eachLayer((layer) => {
        let notice = '';
        if (layer.feature.properties.notice) notice = '<h3>' + layer.feature.properties.notice + '</h3>';

        let sound = '';
        if (layer.feature.properties.sound) sound = '<B>Sound:</B> ' + layer.feature.properties.sound + '<BR><BR>';

        let description = '';
        if (layer.feature.properties.description)
            description = '<B>Description:</B> ' + layer.feature.properties.description + '<BR>';

        const content = '<h2>' + layer.feature.properties.name + '</h2>' + sound + notice + description;
        layer.bindPopup(content);
        layer.bringToBack();
    });
};
