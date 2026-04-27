<?php

declare(strict_types=1);

namespace Phalanx\Site\Handler;

use Phalanx\Scope;
use Phalanx\Task\Scopeable;
use React\Http\Message\Response;

final class StaticFile implements Scopeable
{
    private const MIME_TYPES = [
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'webp' => 'image/webp',
        'woff2' => 'font/woff2',
        'woff' => 'font/woff',
        'html' => 'text/html',
    ];

    public function __invoke(Scope $scope): Response
    {
        $path = $scope->path();
        $publicDir = dirname(__DIR__, 2) . '/public';

        $filePath = realpath($publicDir . '/dist' . $path)
            ?: realpath($publicDir . $path);

        if ($filePath === false || !str_starts_with($filePath, $publicDir)) {
            return new Response(404, ['Content-Type' => 'text/plain'], 'Not Found');
        }

        if (!is_file($filePath)) {
            return new Response(404, ['Content-Type' => 'text/plain'], 'Not Found');
        }

        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mime = self::MIME_TYPES[$ext] ?? 'application/octet-stream';
        $content = file_get_contents($filePath);

        $headers = [
            'Content-Type' => $mime,
            'Cache-Control' => str_contains($path, '/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
        ];

        return new Response(200, $headers, $content);
    }
}
