class RouteUnitConverter {
    static convertMetersToKilometers(distance: number): number {
        return parseFloat((distance / 1000).toFixed(2));
    }
    static convertKilometersToMeters(distance: number): number {
        return distance * 1000;
    }
    static convertTimeToMinutes(time: number): number {
        return time / 60000;
    }
    static convertTimeToHours(time: number): number {
        return time / 3600000;
    }
    static convertTimeToString(time: number): string {
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        return `${hours}h ${minutes}min`;
    }
}

export default RouteUnitConverter;