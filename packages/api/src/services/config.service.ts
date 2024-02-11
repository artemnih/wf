class ConfigService {
    #config: any;

    get config() {
        return this.#config;
    }

    set config(config: any) {
        this.#config = config;
    }
}

export default new ConfigService();
