
```shell
pnpm init -y
```

```shell
pnpm install typescript  @types/node --save-dev

```

```shell
npx tsc --init

```

```json
{
  "compilerOptions": {
    "outDir": "dist",
    "types": [ "node" ],
    "target": "es2016", 
    "module": "NodeNext", 
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "sourceMap": true
  }
}

```

package.json

```json
{
    "type": "module"
}
```

