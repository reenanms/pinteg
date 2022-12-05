# PInterg
> Biblioteca para a geração de telas de CRUD em runtime!

Bbiblioteca responsável por gerar telas em HTML a partir da configuração de um objeto JSON. Facilitando a criação das telas de CRUD, utilizado na maioria dos sistemas.
Além de gerar a tela, com a biblioteca você pode escrever e gerar novos objetos de acordo com o status atual da sua tela.

## Debugando a biblioteca
Para poder executar a biblioteca, basta você clonar o repositório, instalar a dependencias e rodar o comando debug
```
npm install
npm run debug
```

## Primeiros passos
-  Intalando o biblioteca no seu projeto:
```
npm i pinteg
```

- Montando a primeira tela:
```typescript
import pinteg from  "pinteg"

const  configuration  = {
	param1: { type:"string", caption:"Sample with string:", size:  "P" },
	param2: {
		type:"list",
		caption:"Sample with list:",
		size:  "P",
		options: [
			{ key:  "keyA", caption:  "caption A" },
			{ key:  "keyB", caption:  "caption B" }
		]
	},
	param3: { type:"double", caption:"Sample with integer:", size:  "P" },
};

pinteg
	.setDivId("app")
	.setConfiguration(configuration)
	.buildScreen();
```

- Escrevendo valores na tela:
```typescript
const  initialObject  = {
	param1:  "string value",
	param2:  "keyB",
	param3:  9.9,
};

pinteg
	.writeObject(initialObject);
```

 - Lendo valores na tela:
```typescript
const  finalObject  = pinteg.readObject();
console.log(finalObject);
```
