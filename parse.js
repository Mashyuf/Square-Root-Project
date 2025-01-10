const fs = require('node:fs');
const states = ["AL", "AK", "AZ"];

try {
    const template = fs.readFileSync('template.geojson', 'utf8');
    let obj = JSON.parse(template);
    console.log('read file success');
    const features = obj.features;
    states.forEach((state) => cleanGeoJson(state + ".geojson", features));
    let newData = JSON.stringify(obj);

    try {
        fs.writeFileSync('main.geojson', newData);
        console.log('write file success');
    } catch (err) {
        console.log(err);
    }

} catch (err) {
    console.log(err);
}



function cleanGeoJson(file, location) {
    try {
        const data = fs.readFileSync(file, 'utf8');
        let jObj = JSON.parse(data);
        console.log('read file success');
        const rootFolder = jObj.features;
        for(let i = 0; i < rootFolder.length; i++) {
            let districtProperties = rootFolder[i].properties;
            districtProperties= Object.assign(districtProperties, {fill: districtProperties.color, 'fill-opacity': '0.7'});

            delete districtProperties.color;
            delete districtProperties.opacity;

            location.push(rootFolder[i]);
        };
        
    } catch (err) {
        console.log(err);
    }
}

function assignColor(location, income) {
    if (income < 40000) {
        location = Object.assign(location, {styleUrl: "#USCountiesRed"});
    } else if (income >= 40000 && income < 50000) {
        location = Object.assign(location, {styleUrl: "USCountiesOrange"});
    } else if (income >= 50000 && income < 60000) {
        location = Object.assign(location, {styleUrl: "#USCountiesYellow"});
    } else if (income >= 60000 && income < 70000) {
        location = Object.assign(location, {styleUrl: "USCountiesLightGreen"});
    } else if (income >= 70000 && income < 80000) {
        location = Object.assign(location, {styleUrl: "USCountiesGreen"});
    } else if (income >= 80000) {
        location = Object.assign(location, {styleUrl: "USCountiesDarkGreen"});
    }
}

function csvToArr(stringVal, splitter) {
    const [keys, ...rest] = stringVal
      .trim()
      .split("\r\n")
      .map((item) => item.split(splitter));
  
    const formedArr = rest.map((item) => {
      const object = {};
      keys.forEach((key, index) => (object[key] = item.at(index)));
      return object;
    });
    return formedArr;
}
