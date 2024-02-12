class ConfigService {
	#config: any;

	getConfig() {
		return this.#config;
	}

	setConfig(config: any) {
		this.#config = config;
	}
}

export default new ConfigService();
