<?php

declare(strict_types=1);

namespace Phalanx\Site\Handler;

use Phalanx\Scope;
use Phalanx\Task\Scopeable;
use React\Http\Message\Response;

final class HealthCheck implements Scopeable
{
    public function __invoke(Scope $scope): Response
    {
        return Response::json(['status' => 'ok']);
    }
}
