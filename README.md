# k-multiset-combinations

Сервис для генерации комбинаторных сочетаний (k-комбинаций) из мультимножества.

## Features

* Для составления комбинаций используется алгоритм обхода DAG-графа в глубину (DFS) и последующее прямое (декартово) произведение
* Транзакционная вставка данных в MySQL через BULK INSERT с регулируемым BATCH_SIZE
* Чистая архитектура сервиса, изолированность модулей, встроенная инъекция зависимостей
* Готовые к использованию контейнеризация, CI/CD конвейер и Helm декларации для Kubernetes

## Stack

* NestJS
* TypeScript
* mysql2

## Структура проекта

## Документация API

### POST /api/v1/generate

Генерация нового набора комбинаций.

### Параметры запроса (JSON):
| Поле         | Тип     | Обязательный | Описание                     |
|--------------|---------|--------------|------------------------------|
| `items`      | number[]  | да           | Список элемент-количество           |
| `length`   | number  | да           | Длина комбинации                       |

### Пример запроса:
```http
POST /api/v1/users HTTP/1.1
Content-Type: application/json

{
  "items": [1, 2, 1],
  "length": 2
}
```

### Успешный ответ:
```json
{
    "id": 2,
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

Получение информации о состоянии сервиса.

### Пример запроса:
```http
GET /api/v1/status HTTP/1.1
```

### Успешный ответ:
```json
{
    "status": "ok",
    "uptime": 41686.426413128,
    "hostname": "k-multiset-combinations-55dc657d57-qwpvc",
    "timestamp": "2025-04-25T07:49:59.226Z",
    "commitHash": "283d431cf2f50eb7f2944607545751d8c827db0c"
}
```

# Комментарий к тестовому заданию

Поставленная задача относится к проблеме поиска k-комбинаций в мультимножестве (multiset).

Поиск комбинаций заданной длины k в мультимножестве сводится к генерации всех сочетаний типов длины [![\\ k](https://latex.codecogs.com/svg.latex?%5C%5C%20k)](#_) и перемножению их кратностей.

## Уточненная постановка задачи

Дано мультимножество:

<center>

[![\\ M = \{ \underbrace{a_1, \dots, a_1}_{c_1}, \underbrace{a_2, \dots, a_2}_{c_2}, \dots, \underbrace{a_n, \dots, a_n}_{c_n} \},](https://latex.codecogs.com/svg.latex?%5C%5C%20M%20%3D%20%5C%7B%20%5Cunderbrace%7Ba_1%2C%20%5Cdots%2C%20a_1%7D_%7Bc_1%7D%2C%20%5Cunderbrace%7Ba_2%2C%20%5Cdots%2C%20a_2%7D_%7Bc_2%7D%2C%20%5Cdots%2C%20%5Cunderbrace%7Ba_n%2C%20%5Cdots%2C%20a_n%7D_%7Bc_n%7D%20%5C%7D%2C)](#_)

</center>

где [![\\ c_i](https://latex.codecogs.com/svg.latex?%5C%5C%20c_i)](#_) — количество элементов типа [![\\ a_i](https://latex.codecogs.com/svg.latex?%5C%5C%20a_i)](#_).  

**Требуется**: найти все подмножества [![\\ S \subseteq M](https://latex.codecogs.com/svg.latex?%5C%5C%20S%20%5Csubseteq%20M)](#_) размера [![\\ k](https://latex.codecogs.com/svg.latex?%5C%5C%20k)](#_), где все элементы в [![\\ S](https://latex.codecogs.com/svg.latex?%5C%5C%20S)](#_) имеют **разные типы**.  

### Пример
Для `[1, 2, 1]` (типы `A, B, C`):  
- [![\\ M = \{A_1, B_1, B_2, C_1\},](https://latex.codecogs.com/svg.latex?%5C%5C%20M%20%3D%20%5C%7BA_1%2C%20B_1%2C%20B_2%2C%20C_1%5C%7D%2C)](#_)  
- [![\\ k = 2:](https://latex.codecogs.com/svg.latex?%5C%5C%20k%20%3D%202%3A)](#_)  

<center>

[![\\ {[A_1, B_1], [A_1, B_2], [A_1, C_1], [B_1, C_1], [B_2, C_1]}. \\  \\ ](https://latex.codecogs.com/svg.latex?%5C%5C%20%7B%5BA_1%2C%20B_1%5D%2C%20%5BA_1%2C%20B_2%5D%2C%20%5BA_1%2C%20C_1%5D%2C%20%5BB_1%2C%20C_1%5D%2C%20%5BB_2%2C%20C_1%5D%7D.%20%5C%5C%20%20%5C%5C%20)](#_)

</center>
