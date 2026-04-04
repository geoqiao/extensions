# Unix Timestamp Pro

A Raycast extension for converting between Unix timestamps and human-readable dates across multiple timezones. Designed for developers and anyone working with global time data.

## Features

- **🌍 Multi-Timezone Support**: Convert timestamps for 7 major timezones worldwide
- **⚡ Two-Way Conversion**: Timestamp to date, or date to timestamp
- **📋 One-Click Copy**: Copy results directly to clipboard
- **🎯 Smart Detection**: Automatically detects seconds or millisecond timestamps
- **⚙️ Customizable Defaults**: Set your preferred timezone and format in preferences

## Supported Timezones

| Country/Region | Timezone | Code |
|----------------|----------|------|
| 🇨🇳 China (Beijing/Shanghai) | CST | `Asia/Shanghai` |
| 🇺🇸 USA (New York) | EST/EDT | `America/New_York` |
| 🇺🇸 USA (Los Angeles) | PST/PDT | `America/Los_Angeles` |
| 🇵🇱 Poland (Warsaw) | CET/CEST | `Europe/Warsaw` |
| 🇮🇩 Indonesia (Jakarta) | WIB | `Asia/Jakarta` |
| 🇲🇽 Mexico (Mexico City) | CST/CDT | `America/Mexico_City` |
| 🇵🇭 Philippines (Manila) | PST | `Asia/Manila` |

## Commands

### 1. Convert Timestamp to Date

Convert a Unix timestamp to a readable date in your selected timezone.

**Input**: Unix timestamp (seconds or milliseconds)  
**Output**: `Timezone yyyy-MM-dd HH:mm:ss`

**Example**:
```
Input: 1775265682
Output: China (Beijing/Shanghai) 2026-04-04 09:21:22
```

### 2. Generate Timestamp from Date

Create a Unix timestamp from a specific date and time in a selected timezone.

**Input**: Year, Month, Day, Hour, Minute, Second + Timezone  
**Output**: `Timezone timestamp`

**Example**:
```
Input: 2026-04-04 09:29:14 @ China
Output: China (Beijing/Shanghai) 1775294954
```

### 3. Get Current Timestamp

Copy the current Unix timestamp to your clipboard instantly.

**Preferences**:
- Choose between seconds or milliseconds

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/geoqiao/unix-timestamp-pro.git

# Navigate to the directory
cd unix-timestamp-pro

# Install dependencies
npm install

# Build the extension
npm run build

# Or run in dev mode
npm run dev
```

### Requirements

- [Raycast](https://raycast.com/) installed on your Mac
- Node.js 18 or later
- npm or yarn

## Configuration

Open Raycast Preferences → Extensions → Unix Timestamp Pro to customize:

- **Default Timezone**: Your preferred timezone for conversions
- **Default Format**: Currently supports Standard format (extensible for future formats)
- **Timestamp Unit**: Seconds or milliseconds for Current Timestamp command

## Extending Display Formats

The extension is designed to be easily extensible. To add new display formats:

1. Open `src/constants.ts`
2. Add a new format object to the `formats` array:

```typescript
{
  id: "your_format_id",
  name: "Your Format Name",
  format: (date, country) => {
    // Your formatting logic
    return {
      name: country.name,
      value: formattedString,
    };
  },
}
```

3. Update `package.json` preferences to include the new format option

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Fix linting issues
npm run fix-lint
```

## License

MIT License - see LICENSE file for details.

## Acknowledgments

This extension was inspired by and built upon ideas from the following Raycast extensions:

- **[Unix Timestamp](https://github.com/raycast/extensions/tree/main/extensions/unix-timestamp)** by [destiner](https://github.com/destiner) - The original simple timestamp converter with UTC/local timezone support.

- **[Unix Timestamp Converter](https://github.com/raycast/extensions/tree/main/extensions/unix-timestamp-converter)** by [ride-space](https://github.com/ride-space) - An enhanced version with country/region selection and multiple display formats.

Thank you to the original authors and the Raycast community for providing the foundation and inspiration for this enhanced version.

---

Built with ❤️ for developers working across timezones.
