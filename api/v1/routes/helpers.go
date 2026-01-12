package machine_learning_models

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// LoadJSON loads a JSON file into a struct
func LoadJSON(path string, v interface{}) error {
	data, err := os.ReadFile(path)
	if err!= nil {
		return err
	}
	return json.Unmarshal(data, v)
}

// SaveJSON saves a struct to a JSON file
func SaveJSON(path string, v interface{}) error {
	data, err := json.MarshalIndent(v, "", "  ")
	if err!= nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

// GetRandomString returns a random string of a specified length
func GetRandomString(length int) string {
	charset := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}

// GetRandomNumber returns a random number between min and max
func GetRandomNumber(min, max int64) int64 {
	return min + int64(rand.Intn(int(max-min+1)))
}

// GetRandomFloat returns a random float between min and max
func GetRandomFloat(min, max float64) float64 {
	return min + (max - min) * rand.Float64()
}

// GetAbsPath returns the absolute path of a file
func GetAbsPath(path string) string {
	abs, err := filepath.Abs(path)
	if err!= nil {
		log.Fatal(err)
	}
	return abs
}

// GetRemoteFile retrieves a file from a remote URL
func GetRemoteFile(url string, path string) error {
	resp, err := http.Get(url)
	if err!= nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode!= http.StatusOK {
		return fmt.Errorf("failed to retrieve file, status code: %d", resp.StatusCode)
	}

	out, err := os.Create(path)
	if err!= nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	return err
}

// GetEnv returns an environment variable value
func GetEnv(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatal(fmt.Sprintf("missing environment variable: %s", key))
	}
	return val
}

// GetEnvInt returns an environment variable value as an integer
func GetEnvInt(key string) int {
	val := GetEnv(key)
	i, err := strconv.Atoi(val)
	if err!= nil {
		log.Fatal(err)
	}
	return i
}

// GetEnvBool returns an environment variable value as a boolean
func GetEnvBool(key string) bool {
	val := GetEnv(key)
	b, err := strconv.ParseBool(val)
	if err!= nil {
		log.Fatal(err)
	}
	return b
}

// GetEnvFloat returns an environment variable value as a float
func GetEnvFloat(key string) float64 {
	val := GetEnv(key)
	f, err := strconv.ParseFloat(val, 64)
	if err!= nil {
		log.Fatal(err)
	}
	return f
}

// SplitString splits a string into an array of strings based on a delimiter
func SplitString(s string, delimiter string) []string {
	return strings.Split(s, delimiter)
}