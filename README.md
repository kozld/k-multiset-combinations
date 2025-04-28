# k-multiset-combinations

REST API сервис для генерации комбинаторных сочетаний (k-комбинаций) из [мультимножеств](https://en.wikipedia.org/wiki/Multiset) с сохранением результатов в БД.

Проект разработан в рамках [тестового задания](./resources/assets/task.pdf).

## Features

* Реализация с использованием эффективного алгоритма поиска в глубину (DFS).
* Транзакционная вставка данных в MySQL через BULK INSERT с регулируемым BATCH_SIZE.
* Чистая архитектура сервиса, изолированность модулей, покрытие тестами.
* Готовые к использованию контейнеризация, CI/CD конвейер и Helm декларации для Kubernetes.

## Структура проекта

```bash
k-multiset-combinations/
├── __tests__/              # Тестовые сценарии
├── db/migrations/          # SQL миграции для базы данных
├── deployments/helm/       # Декларации Helm для запуска в Kubernetes
├── src/                   
│   ├── app/                # Точка входа: экспортирует основную функцию сервиса
│   ├── dtos/               # Структуры передачи данных с валидацией
│   ├── gateways/           # Контроллеры API
│   ├── library/            # Библиотека "чистых" функций
│   ├── repositories/       # Модуль работы с базой данных
│   └── services/           # Бизнес-логика приложения
│
├── scripts/                
│   └── migration.ts        # Управление миграциями базы данных
│
├── .env.test               # Переменные окружения для локального запуска
├── Dockerfile              # Инструкции для создания Docker-образа
├── docker-compose.yml      # Для запуска сервиса и окружения через docker-compose
├── start.sh                # Запуск миграций и основного сервиса 
├── .gitlab-ci.yml          # Конфигурация CI/CD пайплайна в GitLab
├── jest.config.ts          # Конфигурация для тестового фреймворка Jest
├── package.json            # Метаинформация о проекте и зависимости
└── tsconfig.json           # Конфигурация TypeScript
```

## Usage

## Database design

<center>

![Схема базы данных](./resources/assets/schema.png)

</center>

## Stack

* NestJS
* TypeScript
* mysql2

## Документация API

### POST /api/v1/generate
Генерация нового набора комбинаций

#### Параметры запроса (JSON):
| Поле         | Тип     | Обязательный | Описание                     |
|--------------|---------|--------------|------------------------------|
| `items`      | number[]  | да           | Мультимножество           |
| `length`   | number  | да           | Длина комбинации                       |

#### Пример запроса:
```http
POST /api/v1/generate HTTP/1.1
Content-Type: application/json
{
  "items": [1, 2, 1],
  "length": 2
}
```

#### Пример ответа:
```json
{
    "id": 1,
    "combination": [
        ["A1","B1"],
        ["A1","B2"],
        ["A1","C1"],
        ["B1","C1"],
        ["B2","C1"]
    ]
}
```

### GET /api/v1/status
Получение информации о состоянии сервиса

#### Пример запроса:
```http
GET /api/v1/status HTTP/1.1
```

#### Пример ответа:
```json
{
    "status": "ok",
    "uptime": 41686.426413128,
    "hostname": "k-multiset-combinations-55dc657d57-qwpvc",
    "timestamp": "2025-04-25T07:49:59.226Z",
    "commitHash": "283d431cf2f50eb7f2944607545751d8c827db0c"
}
```

## Комментарий к тестовому заданию

Поставленная задача относится к проблеме поиска k-комбинаций в [мультимножестве (multiset)](https://en.wikipedia.org/wiki/Multiset).

Поиск комбинаций заданной длины k в мультимножестве сводится к нахождению всех сочетаний типов длины [![\\ k](https://latex.codecogs.com/svg.latex?%5C%5C%20k)](#_) и перемножению их кратностей.

### Уточненная постановка задачи

Дано мультимножество:

<div align="center">

[![\\ M = \{ \underbrace{a_1, \dots, a_1}_{c_1}, \underbrace{a_2, \dots, a_2}_{c_2}, \dots, \underbrace{a_n, \dots, a_n}_{c_n} \},](https://latex.codecogs.com/svg.latex?%5C%5C%20M%20%3D%20%5C%7B%20%5Cunderbrace%7Ba_1%2C%20%5Cdots%2C%20a_1%7D_%7Bc_1%7D%2C%20%5Cunderbrace%7Ba_2%2C%20%5Cdots%2C%20a_2%7D_%7Bc_2%7D%2C%20%5Cdots%2C%20%5Cunderbrace%7Ba_n%2C%20%5Cdots%2C%20a_n%7D_%7Bc_n%7D%20%5C%7D%2C)](#_)

</div>

где [![\\ c_i](https://latex.codecogs.com/svg.latex?%5C%5C%20c_i)](#_) — количество элементов типа [![\\ a_i](https://latex.codecogs.com/svg.latex?%5C%5C%20a_i)](#_).  

**Требуется**: найти все подмножества [![\\ S \subseteq M](https://latex.codecogs.com/svg.latex?%5C%5C%20S%20%5Csubseteq%20M)](#_) размера [![\\ k](https://latex.codecogs.com/svg.latex?%5C%5C%20k)](#_), где все элементы в [![\\ S](https://latex.codecogs.com/svg.latex?%5C%5C%20S)](#_) имеют **разные типы**.  

### Пример
Для `[1, 2, 1]` (типы `A, B, C`):  
- [![\\ M = \{A_1, B_1, B_2, C_1\},](https://latex.codecogs.com/svg.latex?%5C%5C%20M%20%3D%20%5C%7BA_1%2C%20B_1%2C%20B_2%2C%20C_1%5C%7D%2C)](#_)  
- [![\\ k = 2:](https://latex.codecogs.com/svg.latex?%5C%5C%20k%20%3D%202%3A)](#_)  

<div align="center">

[![\\ {[A_1, B_1], [A_1, B_2], [A_1, C_1], [B_1, C_1], [B_2, C_1]}. \\  \\ ](https://latex.codecogs.com/svg.latex?%5C%5C%20%7B%5BA_1%2C%20B_1%5D%2C%20%5BA_1%2C%20B_2%5D%2C%20%5BA_1%2C%20C_1%5D%2C%20%5BB_1%2C%20C_1%5D%2C%20%5BB_2%2C%20C_1%5D%7D.%20%5C%5C%20%20%5C%5C%20)](#_)

</div>
