## Demo runs

### Full check
```shell

node ./plugins/main.js --batch=10 --nativescope=true --roleAssignments=true --helperTexts=true --checkAad=true --scanAuditLogs --composites


``` 

### Single service
```shell
node ./plugins/main.js --batch=10 --nativescope=true --roleAssignments=true --checkAad=false --namespace="microsoft.datafactory" --helperTexts=true
``` 

### Create Templates

`` node templatehelpers/east.js ``

- Review deep dive areas 
  - SPN with password
  - Gaps CA 
  - SPN with directory role 

`` node templatehelpers/functionsWithVault.js`` 

### Speedup Demo

```
# real    2m40.555s
time node ./plugins/main.js --batch=2 --nativescope=true --roleAssignments=true --helperTexts=true --checkAad=true --scanAuditLogs --composites

```

```
real    1m20.207s
time node ./plugins/main.js --batch=10 --nativescope=true --roleAssignments=true --helperTexts=true --checkAad=true --scanAuditLogs --composites

```
