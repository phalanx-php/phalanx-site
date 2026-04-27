<?php

declare(strict_types=1);

namespace Phalanx\Site\Handler;

use Phalanx\Scope;
use Phalanx\Task\Scopeable;
use React\Http\Message\Response;

final class HomePage implements Scopeable
{
    private static ?string $html = null;

    public function __invoke(Scope $scope): Response
    {
        self::$html ??= file_get_contents(dirname(__DIR__, 2) . '/public/dist/index.html')
            ?: file_get_contents(dirname(__DIR__, 2) . '/public/index.html');

        if (self::$html === false) {
            return new Response(500, ['Content-Type' => 'text/plain'], 'Missing index.html');
        }

        return new Response(200, ['Content-Type' => 'text/html; charset=utf-8'], self::$html);
    }
}
