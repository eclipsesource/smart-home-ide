import { inject, injectable } from "inversify";
import { TaskContribution, TaskProviderRegistry, TaskService } from "@theia/task/lib/browser";
import { TaskConfiguration } from "@theia/task/lib/common/task-protocol";
import { CommandContribution, MenuContribution, MenuModelRegistry, CommandRegistry, MessageService } from "@theia/core";
import { TerminalService } from "@theia/terminal/lib/browser/base/terminal-service"
import { SmartHomeMenus } from "../common/smart-home-menu";

const RunCleanTaskCommand = {
  id: 'SmartHomeEditor.runclean.command',
  label: "Clean Workspace"
};
const RunBuildTaskCommand = {
  id: 'SmartHomeEditor.runbuild.command',
  label: "Run Build"
};
const RunTestsTaskCommand = {
  id: 'SmartHomeEditor.runtests.command',
  label: "Run Tests"
};

// TODO: allow to configure the pom file name
const pomFileName = "essh-pom.xml";
const runCleanTask: TaskConfiguration = {
  label: RunCleanTaskCommand.label,
  type: 'shell',
  cwd: "${workspaceFolder}",
  command: "mvn",
  args: [
    "clean",
    "-f",
    pomFileName
  ]
}
const runBuildTask: TaskConfiguration = {
  label: RunBuildTaskCommand.label,
  type: 'shell',
  cwd: "${workspaceFolder}",
  command: "mvn",
  args: [
    "package",
    "-Dmaven.test.skip=true",
    "-f",
    pomFileName
  ]
}
const runTestsTask: TaskConfiguration = {
  label: RunTestsTaskCommand.label,
  type: 'shell',
  cwd: "${workspaceFolder}",
  command: "mvn",
  args: [
   "verify",
   "surefire-report:report",
   "-Dmaven.test.failure.ignore=true",
    "-f",
    pomFileName
  ]
}

@injectable()
export class SCMCommandsContribution implements CommandContribution {

  @inject(TaskService)
  protected readonly taskService: TaskService;

  @inject(MessageService)
  protected readonly messageService: MessageService;

  @inject(TerminalService)
  protected readonly terminalService: TerminalService;

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(RunCleanTaskCommand, this.runTaskHandler(runCleanTask));
    registry.registerCommand(RunBuildTaskCommand, this.runTaskHandler(runBuildTask));
    registry.registerCommand(RunTestsTaskCommand, this.runTaskHandler(runTestsTask));
  }

  protected runTaskHandler(config: TaskConfiguration) {
    return {
      execute: () => {
        this.taskService.run(config.type, config.label);
      }
    }
  }

}

@injectable()
export class SCMTasksContribution implements TaskContribution {
  registerProviders(providers: TaskProviderRegistry) {
    providers.register('shell', {
      provideTasks: () => new Promise((resolve, reject) => resolve([runCleanTask, runBuildTask, runTestsTask]))
    });
  }
}

@injectable()
export class SCMMenuActionsContribution implements MenuContribution {

  registerMenus(menus: MenuModelRegistry): void {
    menus.registerMenuAction(SmartHomeMenus.SMART_HOME, {
      commandId: RunCleanTaskCommand.id,
      label: RunCleanTaskCommand.label
    });
    menus.registerMenuAction(SmartHomeMenus.SMART_HOME, {
      commandId: RunBuildTaskCommand.id,
      label: RunBuildTaskCommand.label
    });
    menus.registerMenuAction(SmartHomeMenus.SMART_HOME, {
      commandId: RunTestsTaskCommand.id,
      label: RunTestsTaskCommand.label
    });
  }
}
