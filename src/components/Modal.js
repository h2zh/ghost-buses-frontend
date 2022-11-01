import React from "react";
import BusRouteDetails from "./BusRouteDetails";

export default function Modal({ selectedRoute, closeModal }) {

    //data percentiles

  // i averaged the data for these percentiles in excel. you can use this key by using the index as the first digit of the percentile block, so percentileKeys[2] will be percentiles from 20-29% 
  // FIX ME : eventually we're going to want these numbers rendered dynamically when the backend/data updates


  var percentileKeys = [62, 72, 75, 77, 80, 83, 86, 90, 93, 95]



  // take all the ratios from the data and average out each line's mean bus reliablility

  // most recent data only shows relability ("acc") for weekday bus lines, so setting totalAcc to the lines ratio. Leaving below code in because this is a short term change and i dont want to re-write it!!

  // const weekdayRoutes = selectedRoute.filter(
  //   (route) => route.properties.day_type === "wk"
  // );
  // const sundayRoutes = selectedRoute.filter(
  //   (route) => route.properties.day_type === "sun"
  // );
  // const saturdayRoutes = selectedRoute.filter(
  //   (route) => route.properties.day_type === "sat"
  // );

  // const weekdayAcc =
  //   ((weekdayRoutes[0].properties.ratio + weekdayRoutes[1].properties.ratio) /
  //     2) *
  //   100;
  // const saturdayAcc =
  //   saturdayRoutes.length > 0
  //     ? ((saturdayRoutes[0].properties.ratio +
  //         saturdayRoutes[1].properties.ratio) /
  //         2) *
  //       100
  //     : 0;
  // const sundayAcc =
  //   sundayRoutes.length > 0
  //     ? ((sundayRoutes[0].properties.ratio + sundayRoutes[1].properties.ratio) /
  //         2) *
  //       100
  //     : 0;

  // const totalDataPoints =
  //   (saturdayAcc > 0 ? 1 : 0) +
  //   (sundayAcc > 0 ? 1 : 0) +
  //   (weekdayAcc > 0 ? 1 : 0);
  const totalAcc = (selectedRoute[0].properties.ratio)*100;

  //round the percentages to the nearest ten

  function round10(x) {
    let digits = x.toString().split("");
    if (digits[1] >= 5) {
      digits = [Number(digits[0]) + 1, 0];
    } else {
      digits[1] = 0;
    }
    digits = digits.map((x) => Number(x));
    console.log(parseInt(digits.join("")))
    return parseInt(digits.join(""));
  }

  //reduce fraction to lowest common denonminatior

  function reduce(numerator, denominator) {
    var gcd = function gcd(a, b) {
      return b ? gcd(b, a % b) : a;
    };
    gcd = gcd(numerator, denominator);
    return [numerator / gcd, denominator / gcd];
  }

  //fraction of buses on average that are "ghost buses"

  const calcBusFraction = (acc)  => {
    let fraction
    if (acc > 22 && acc < 27) {
      fraction = [3, 4]
    } else if (acc > 72 && acc < 77){
      fraction = [1, 4]
    } else {
      console.log(Math.round(acc))
      fraction = reduce((100 - round10(Math.round(acc))), 100);
    }

    return fraction
  }
  
  const busFraction = calcBusFraction(totalAcc.toFixed(0))
  return (
    <div className="modal" onClick={closeModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button onClick={closeModal} className="close-btn">
          x
        </button>
        <BusRouteDetails
          selectedRoute={selectedRoute}
          totalAcc={totalAcc}
          busFraction={busFraction}
          percentileKeys={percentileKeys}

        />
        <p className="modal-footnote">
          * = weekday ridership taken from{" "}
          <a
            rel="noreferrer"
            target="_blank"
            href="https://www.transitchicago.com/assets/1/6/Monthly_Ridership_2022-7(Final).pdf"
          >
            CTA Ridership Report
          </a>{" "}
        </p>
      </div>
    </div>
  );
}