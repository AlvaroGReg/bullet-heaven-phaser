# Bullet Heaven con Phaser

Proyecto bullet-heaven 2D en navegador. El objetivo no es diseñar una arquitectura final ni optimizar prematuramente, sino comprender los sistemas que componen este tipo de juego mediante incrementos pequeños y jugables.

## Tecnologias

- Phaser 3
- TypeScript
- Vite

## Requisitos

- Node.js 20 o posterior
- npm

## Ejecutar el proyecto

```bash
npm install
npm run dev
```

Para generar una version de produccion:

```bash
npm run build
```

## Estructura inicial

```text
src/
  game/       Configuracion de Phaser
  scenes/     Flujo y pantallas del juego
  main.ts     Punto de entrada
```

Las carpetas para entidades, sistemas e interfaz se incorporaran cuando el juego tenga codigo que justifique separarlas.

## Agentes y skills

La configuracion de agentes se centraliza en `.agents/`:

- `.agents/AGENTS.md`: instrucciones comunes y politica de uso de skills.
- `.agents/agents/`: roles reutilizables para implementacion, planificacion y revision.
- `.agents/skills/`: skills instaladas con `npx skills add`.
- `skills-lock.json`: registro reproducible de las skills instaladas.

Los roles disponibles son:

- `phaser-implementer`: implementa incrementos pequenos y ejecuta la compilacion.
- `gameplay-planner`: divide una mecanica en pasos jugables sin modificar codigo.
- `code-reviewer`: revisa cambios en busca de errores, regresiones y pruebas faltantes.

OpenCode carga `.agents/AGENTS.md`, las skills y los roles mediante `opencode.json`. Reinicialo despues de modificar esta configuracion, los roles o las skills.

## Ruta de desarrollo

1. Mantener una escena base que cargue correctamente en el navegador.
2. Crear al jugador: representacion visual, movimiento en ocho direcciones y limites del mapa.
3. Incorporar un enemigo que persiga al jugador.
4. Implementar un ataque automatico, dano, vida y muerte.
5. Anadir enemigos mediante un generador sencillo y aumentar su cantidad con el tiempo.
6. Crear gemas de experiencia, recogida y subida de nivel.
7. Mostrar una seleccion de mejoras al subir de nivel: dano, cadencia, velocidad, proyectiles o alcance.
8. Construir la interfaz de partida: vida, nivel, experiencia y temporizador.
9. Incorporar varios tipos de enemigos, armas y mejoras.
10. Anadir pantallas de inicio, derrota y reinicio de partida.
11. Revisar las responsabilidades del codigo: escenas, entidades, combate, generacion, progresion e interfaz.
12. Mejorar rendimiento solo cuando exista un problema observable y medible.

## Limites intencionales

Al inicio no se implementaran ECS, object pooling, persistencia, metaprogresion, multijugador ni optimizaciones para miles de entidades. Se anadiran unicamente cuando el aprendizaje o una limitacion real del prototipo lo requieran.

## Siguiente paso

Implementar el jugador y su movimiento dentro de `GameScene`.
