<?php

declare(strict_types=1);

namespace Phalanx\Site\Handler;

use GuzzleHttp\Psr7\Response;
use Phalanx\Http\RequestContext;
use Phalanx\Task\Scopeable;

final class HealthCheck implements Scopeable
{
    public function __invoke(RequestContext $ctx): Response
    {
        return new Response(200, ['Content-Type' => 'application/json'], '{"status":"ok"}');
    }
}
