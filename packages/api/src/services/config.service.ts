class ConfigService {
    #config: any;

    get config() {
        return this.#config;
    }

    set config(config: any) {
        console.log('Setting config:', config);
        this.#config = config;
    }
}

export default new ConfigService();
