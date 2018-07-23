export default {
    // funkcija za spremanje podataka u local storage, kao parametre prima ključnu riječ, podatke i vrijeme trajanja
    setLocalItem (key, value, time) {

        let timestamp = this.setExpirationTime(time);

        let storageObj = {
            'timestamp': timestamp,
            'value': value
        };

        return localStorage.setItem(key, JSON.stringify(storageObj));
    },

    // funkcija za dohvaćanje podataka iz local storage-a, kao parametar prima ključnu riječ
    // ukoliko podaci ne postoje ili je vrijeme isteklo (ujedno i briše te podatke) vraća false
    getLocalItem(key) {

        let item = JSON.parse(localStorage.getItem(key));

        if (item) {
            let time = this.evaluateTimeToExpire(item.timestamp);
            if (time) {
                return item.value;
            } else {
                this.removeLocalItem(key);
                return false;
            }
        } else {
            return false;
        }
    },

    // funkcija koja postavlja vrijeme trajanja
    setExpirationTime(lifespan) {
        let currentTime = Math.floor(Date.now() / 1000);

        let timeToExpire;

        if (lifespan !== 0) {
            timeToExpire = currentTime + lifespan;
        } else {
            timeToExpire = 0;
        }

        return timeToExpire;
    },

    // funkcija koja provjerava da li je vrijeme trajanja storage-a isteklo
    evaluateTimeToExpire(timestamp) {

        let currentTime = Math.floor(Date.now() / 1000);

        return (currentTime <= timestamp || timestamp === 0);
    },

    // funkcija za brisanje local storage-a, kao parametar prima ključnu riječ
    removeLocalItem(key) {
        return localStorage.removeItem(key);
    }
}