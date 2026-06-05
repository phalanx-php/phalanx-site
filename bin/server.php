#!/usr/bin/env php
<?php

declare(strict_types=1);

use Phalanx\Http\Http;
use Phalanx\Http\HttpApplication;
use Phalanx\Http\RouteGroup;
use Phalanx\Site\Handler\HealthCheck;
use Phalanx\Site\Handler\HomePage;
use Phalanx\Site\Handler\StaticFile;
use Phalanx\Site\PhalanxSiteBundle;

require_once dirname(__DIR__) . '/vendor/autoload_runtime.php';

return static function (array $context): HttpApplication {
    return Http::starting($context)
        ->providers(new PhalanxSiteBundle())
        ->routes(RouteGroup::of([
            'GET /' => HomePage::class,
            'GET /health' => HealthCheck::class,
            'GET /{path:.+}' => StaticFile::class,
        ]))
        ->build();
};
