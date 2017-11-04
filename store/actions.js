import axios from 'axios'
import Services from './services'

export default {
    getWechatSignature({ commit }, url) {
        return Services.getWechatSignature(url)
    },

    getWechatOAuth({ commit }, url) {
        return Services.getWechatOAuth(url)
    },

    async fetchHouses({ state }) {
        const res = await Services.fetchHouses()

        state.houses = res.data[0].data
        return res
    },

    async fetchCities({ state }) {
        const res = await Services.fetchCities()

        state.cities = res.data.data

        return res
    },

    async fetchCharacters({ state }) {
        const res = await Services.fetchCharacters()

        state.characters = res.data.data
        console.log(res);
        return res
    }

}