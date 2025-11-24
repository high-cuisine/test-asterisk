# Asterisk Docker Setup

Полная настройка Asterisk в Docker контейнере с поддержкой внешнего SIP trunk и интеграцией с Node.js.

## Структура проекта

```
asterisk/
├── Dockerfile              # Образ Asterisk
├── docker-compose.yml      # Docker Compose конфигурация
├── configs/                # Конфигурационные файлы Asterisk
│   ├── asterisk.conf       # Основной конфиг
│   ├── sip.conf           # SIP настройки (trunk и пользователи)
│   ├── extensions.conf    # Диапланы (маршрутизация вызовов)
│   ├── manager.conf       # AMI (Asterisk Manager Interface)
│   ├── modules.conf       # Загружаемые модули
│   ├── logger.conf        # Настройки логирования
│   ├── rtp.conf           # RTP настройки
│   ├── voicemail.conf     # Голосовая почта
│   ├── features.conf      # Дополнительные функции
│   ├── indications.conf   # Тональные сигналы
│   └── musiconhold.conf   # Музыка на удержании
├── logs/                   # Логи (создается автоматически)
├── recordings/             # Записи разговоров (создается автоматически)
└── data/                   # Данные Asterisk (создается автоматически)
```

## Быстрый старт

### 1. Настройка SIP Trunk

Отредактируйте файл `configs/sip.conf` и настройте секцию `[trunk-provider]`:

```ini
[trunk-provider]
type=peer
host=sip.provider.com              # Адрес вашего провайдера
username=your_username             # Ваш username
secret=your_password               # Ваш пароль
```

### 2. Настройка внутренних пользователей

В том же файле `configs/sip.conf` уже настроены пользователи 1001, 1002, 1003.
Измените пароли на свои:

```ini
[1001]
secret=password1001                # Измените пароль!
```

### 3. Настройка AMI для Node.js

В файле `configs/manager.conf` настройте доступ:

```ini
[nodejs]
secret = nodejs_password_123        # Измените пароль!
permit = 192.168.0.0/255.255.0.0   # IP вашего Node.js сервера
```

### 4. Запуск

```bash
# Сборка и запуск
docker-compose up -d

# Просмотр логов
docker-compose logs -f asterisk

# Подключение к консоли Asterisk
docker exec -it asterisk-server asterisk -rvvv
```

## Порты

- **5060/udp, 5060/tcp** - SIP протокол
- **10000-20000/udp** - RTP (медиа потоки)
- **5038/tcp** - AMI (Asterisk Manager Interface)

## Основные команды в консоли Asterisk

```bash
# Показать SIP пиры
sip show peers

# Показать активные вызовы
core show channels

# Перезагрузить конфигурацию SIP
sip reload

# Перезагрузить диапланы
dialplan reload

# Показать контексты
dialplan show

# Показать регистрации
sip show registry
```

## Интеграция с Node.js

### Через AMI (Asterisk Manager Interface)

Используйте библиотеку `node-ami` или `asterisk-manager`:

```javascript
const ami = require('asterisk-manager');

const manager = ami(5038, 'localhost', 'nodejs', 'nodejs_password_123', true);

manager.on('connect', () => {
  console.log('Connected to AMI');
});

manager.on('event', (evt) => {
  console.log('Event:', evt);
});
```

### Через AGI (Asterisk Gateway Interface)

В `extensions.conf` используйте:

```ini
exten => _X.,1,AGI(agi://nodejs-server:3000/process-call)
```

## Безопасность

⚠️ **ВАЖНО**: Перед использованием в продакшене:

1. Измените все пароли в `sip.conf` и `manager.conf`
2. Ограничьте доступ к AMI только с вашего Node.js сервера
3. Настройте firewall для защиты портов
4. Используйте TLS для SIP (требует дополнительной настройки)

## Отладка

```bash
# Логи в реальном времени
tail -f logs/messages

# Проверка конфигурации
docker exec asterisk-server asterisk -rx "core show settings"

# Тест SIP регистрации
docker exec asterisk-server asterisk -rx "sip show registry"
```

## Остановка

```bash
docker-compose down
```

## Полезные ссылки

- [Asterisk Documentation](https://wiki.asterisk.org/)
- [SIP Configuration](https://wiki.asterisk.org/wiki/display/AST/Configuring+res_pjsip)
- [AMI Documentation](https://wiki.asterisk.org/wiki/display/AST/Asterisk+Manager+Interface+AMI)

