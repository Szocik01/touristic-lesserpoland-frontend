import Sunny from "../assets/images/weather/sun.png";
import Cloudy from "../assets/images/weather/cloud.png";
import Rainy from "../assets/images/weather/rainy.png";
import Snowy from "../assets/images/weather/snowy.png";
import Thunderstorm from "../assets/images/weather/storm.png";
import Foggy from "../assets/images/weather/fogg.png";
import SnowyRainy from "../assets/images/weather/snowy-rainy.png";
import CloudySunny from "../assets/images/weather/cloudy-sunny.png";
import CloudySunnyRainy from "../assets/images/weather/cloudy-sunny-rainy.png";

export const weatherIdMap: { [key: string]: string } = {
    "0": Sunny,
    "1": CloudySunny,
    "2": CloudySunny,
    "3": Cloudy,
    "45": Foggy,
    "48": Foggy,
    "51": CloudySunnyRainy,
    "53": CloudySunnyRainy,
    "55": CloudySunnyRainy,
    "56": SnowyRainy,
    "57": SnowyRainy,
    "61": Rainy,
    "63": Rainy,
    "65": Rainy,
    "66": SnowyRainy,
    "67": SnowyRainy,
    "71": Snowy,
    "73": Snowy,
    "75": Snowy,
    "77": Snowy,
    "80": Rainy,
    "81": Rainy,
    "82": Rainy,
    "85": Snowy,
    "86": Snowy,
    "95": Thunderstorm,
    "96": Thunderstorm,
    "99": Thunderstorm
}