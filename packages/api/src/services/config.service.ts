class ConfigService {
    #config: any;

    getConfig() {
        return this.#config;
    }

    setConfig(config: any) {
        console.log('Setting config:', config);
        this.#config = config;
    }
}

export default new ConfigService();
