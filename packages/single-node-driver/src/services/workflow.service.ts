const fs = require("fs");
const spawn = require("child_process").spawn;

class WorkflowService {

  async submit(cwl: any) {
    const temp = Math.random().toString(36).substring(2, 15);

    fs.writeFileSync(`./temp/${temp}.json`, JSON.stringify(cwl, null, 2), "utf-8");

    console.log("Starting process");

    const myProcess = spawn("cwltool", [`./temp/${temp}.json`], {
      detached: true,
    });

    const pid = myProcess.pid;
    if (!pid) {
      return null;
    }
    console.log(`Process started with pid ${pid}`);

    fs.writeFileSync(`./loggings/stdout-${pid}.log`, "", "utf-8");

    myProcess.stderr.on('data', (data: any) => {
      fs.appendFileSync(`./loggings/stdout-${pid}.log`, data, "utf-8");
      console.error(`${data}`);
    });

    myProcess.on('error', (error: any) => {
      console.error('Failed to start child process.', error);
    });

    return pid;
  }


  async status(pids: string) {
    const pid = parseInt(pids);
    console.log("Checking status of process", pid);
    try {
      const result = process.kill(pid, 0);
      return "Process running";
    } catch (error) {
      // process no longer exists
      if (error.code === "ESRCH") {
        return "Process finished";
      }

      // permission denied
      if (error.code === "EPERM") {
        return "Permission denied";
      }

      return "Unknown error while checking process";
    }
  }

  async logs(id: string) {
    try {
      const log = fs.readFileSync(`./loggings/stdout-${id}.log`, "utf-8");
      return log;
    } catch (error) {
      return "No logs available";
    }
  }

  async stop(pid: string) {
    try {
      const result = process.kill(parseInt(pid), "SIGTERM");
      return "Process stopped";
    } catch (error) {
      return "Process not running";
    }
  }
}

export default new WorkflowService();
