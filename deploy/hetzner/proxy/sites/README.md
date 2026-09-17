Each application owns one Caddy site file in this directory.

For example, `yes-chef.caddy`:

```caddyfile
recipes.example.com {
	encode zstd gzip
	reverse_proxy yes-chef:8080
}
```

The upstream name is a network alias on the shared external Docker network
named `proxy`; applications do not publish their ports on the host.

