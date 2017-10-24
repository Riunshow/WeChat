import axios from 'axios'
import Services from './services'

export default {
    getWechatSignature({ commit }, url) {
        return Services.getWechatSignature(url)
    }
}