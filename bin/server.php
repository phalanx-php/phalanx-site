#!/usr/bin/env php
<?php

declare(strict_types=1);

use Phalanx\Http\Application;
use Phalanx\Http\RouteGroup;
use Phalanx\Http\Server;
use Phalanx\Site\Handler\HealthCheck;
use Phalanx\Site\Handler\HomePage;
use Phalanx\Site\Handler\StaticFile;
use Phalanx\Site\PhalanxSiteBundle;

require_once dirname(__DIR__) . '/vendor/autoload_runtime.php';

return static function (array $context): Application {
    return Server::starting($context)
        ->providers(new PhalanxSiteBundle())
        ->routes(RouteGroup::of([
            'GET /' => HomePage::class,
            'GET /health' => HealthCheck::class,
            'GET /{path:.+}' => StaticFile::class,
        ]))
        ->build();
};
