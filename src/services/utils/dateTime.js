export const dateTime = () => {
    const date = new Date();
    const fullDate = date.toLocaleDateString();
    const hour = date.getHours();
    const min = date.getMinutes();
    let minutes;
    if (min < 10) {
        minutes = `0${min}`
    } else {
        minutes = min
    }
    const purchase_datetime = `Fecha: ${fullDate} / Hora: ${hour}:${minutes}`;
    return purchase_datetime;
}